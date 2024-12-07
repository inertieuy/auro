import { ITopUpReq, ITopUpRes } from '../model/topup';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../client/prisma';
import { MidtransService } from './midtrans';
import { HTTPException } from 'hono/http-exception';

export class TopUpService {
  static async InitializeTopUp(
    req: ITopUpReq,
    accountId: string,
  ): Promise<ITopUpRes> {
    const orderId = uuidv4();

    const genSnapUrl = await MidtransService.generateSnapUrl(
      orderId,
      req.amount,
    );

    await prisma.topUp.create({
      data: {
        id: orderId,
        accountId: accountId,
        status: 0,
        amount: req.amount,
        snapUrl: genSnapUrl,
      },
    });
    return {
      snapUrl: genSnapUrl,
      orderId: orderId,
    };
  }

  static async ConfirmedTopUp(id: string): Promise<void> {
    const topUp = await prisma.topUp.findUnique({
      where: {
        id: id,
      },
    });
    if (!topUp) {
      throw new HTTPException(404, {
        message: 'topup id not found',
      });
    }
    if (topUp.status === 1) {
      throw new HTTPException(400, { message: 'Top-up already processed' });
    }
    const account = await prisma.accounts.findUnique({
      where: {
        id: topUp.accountId,
      },
    });
    if (!account) {
      throw new HTTPException(404, {
        message: 'account not found',
      });
    }

    await prisma.transaction.create({
      data: {
        id: uuidv4(),
        txaccountId: '00',
        rxaccountId: account.id,
        amount: topUp.amount,
        transactionType: 'C',
        transactionDateTime: new Date(),
      },
    });

    await prisma.accounts.update({
      where: {
        id: account.id,
      },
      data: {
        balance: {
          increment: topUp.amount,
        },
      },
    });

    await prisma.topUp.update({
      where: {
        id: id,
      },
      data: {
        status: 1,
      },
    });

    await prisma.notification.create({
      data: {
        id: uuidv4(),
        accountId: account.id,
        title: 'top up',
        body: `top up senilai ${topUp.amount.toFixed(2)} berhasil`,
        status: 1,
        isRead: 0,
        createdAt: new Date(),
      },
    });
  }
}
