import { HTTPException } from 'hono/http-exception';
import { prisma } from '../client/prisma';
import {
  ITransactionExecuteReq,
  ITransferInquiryReq,
  ITransferInquiryRes,
} from '../model/transfer_inquiry';
import { Generator } from '../util/generator';
import { v4 as uuidv4 } from 'uuid';
import { IAccounts } from '../model/user';

export class TransactionService {
  static async TransactionInquiry(
    jwtPayload: { id: string; userName: string },
    req: ITransferInquiryReq,
  ): Promise<ITransferInquiryRes> {
    const txAcc = await prisma.accounts.findUnique({
      where: {
        userId: jwtPayload.id,
      },
    });

    if (!txAcc) {
      throw new HTTPException(400, {
        message: 'user id not found',
      });
    }

    const rxAcc = await prisma.accounts.findFirst({
      where: {
        accountName: req.accountName,
      },
    });
    if (!rxAcc) {
      throw new HTTPException(400, {
        message: 'account not found',
      });
    }

    if (txAcc.balance < req.amount) {
      throw new HTTPException(400, {
        message: 'insufficient balance',
      });
    }

    if (txAcc.accountName === rxAcc.accountName) {
      throw new HTTPException(400, {
        message: 'account is same',
      });
    }

    const inquiryKey = Generator.genString(16);

    await prisma.transactionInquiry.create({
      data: {
        id: uuidv4(),
        inquiryKey: inquiryKey,
        txName: txAcc.accountName,
        rxName: rxAcc.accountName,
        amount: req.amount,
        expiredAt: new Date(Date.now() + 60 * 1000),
      },
    });
    return {
      inquiryKey,
    };
  }

  static async TransactionExecute(req: ITransactionExecuteReq): Promise<void> {
    const val = await prisma.transactionInquiry.findUnique({
      where: {
        inquiryKey: req.inquiryKey,
      },
    });
    if (!val) {
      throw new HTTPException(400, {
        message: 'inquiryKey is invalid',
      });
    }

    if (new Date() >= val.expiredAt) {
      await prisma.transactionInquiry.delete({
        where: {
          inquiryKey: req.inquiryKey,
        },
      });
      throw new HTTPException(400, {
        message: 'inquiryKey expired',
      });
    }
    const txAcc = await prisma.accounts.findUnique({
      where: {
        accountName: val.txName,
      },
    });
    if (!txAcc) {
      throw new HTTPException(400, {
        message: 'tx account not found',
      });
    }
    const rxAcc = await prisma.accounts.findUnique({
      where: {
        accountName: val.rxName,
      },
    });
    if (!rxAcc) {
      throw new HTTPException(400, {
        message: 'rx account not found',
      });
    }

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          id: uuidv4(),
          txaccountId: txAcc.id,
          rxaccountId: rxAcc.id,
          amount: val.amount,
          transactionType: 'transfer',
          transactionDateTime: new Date(),
        },
      }),
    ]);
    await prisma.accounts.update({
      where: {
        accountName: val.txName,
      },
      data: {
        balance: {
          decrement: val.amount,
        },
      },
    });
    await prisma.accounts.update({
      where: {
        accountName: val.rxName,
      },
      data: {
        balance: {
          increment: val.amount,
        },
      },
    });

    await prisma.transactionInquiry.delete({
      where: {
        inquiryKey: req.inquiryKey,
      },
    });

    await this.notificationSent(txAcc, rxAcc, val.amount);
  }

  static async notificationSent(
    tx: IAccounts,
    rx: IAccounts,
    amount: number,
  ): Promise<void> {
    const notifications = [
      {
        id: uuidv4(),
        userId: tx.userId,
        title: 'transfer sukses',
        body: `transfer senilai ${amount.toFixed(2)} berhasil dikirim`,
        status: 1,
        isRead: 0,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: rx.userId,
        title: 'dana diterima',
        body: `dana sebesar ${amount.toFixed(2)} berhasil diterima`,
        status: 1,
        isRead: 0,
        createdAt: new Date(),
      },
    ];
    await prisma.notification.createMany({ data: notifications });
  }
}
