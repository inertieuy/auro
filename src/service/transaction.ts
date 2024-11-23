import { HTTPException } from 'hono/http-exception';
import { prisma } from '../client/prisma';
import {
  ITransferInquiryReq,
  ITransferInquiryRes,
} from '../model/transfer_inquiry';
import { Generator } from '../util/generator';
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
  static async TransferInquiry(
    jwtPayload: { id: string; userName: string },
    req: ITransferInquiryReq,
  ): Promise<ITransferInquiryRes> {
    const account = await prisma.accounts.findUnique({
      where: {
        userId: jwtPayload.id,
      },
    });

    if (!account) {
      throw new HTTPException(400, {
        message: 'user id not found',
      });
    }

    const dofAccount = await prisma.accounts.findFirst({
      where: {
        accountName: req.accountName,
      },
    });
    if (!dofAccount) {
      throw new HTTPException(400, {
        message: 'account not found',
      });
    }

    if (account.balance < req.amount) {
      throw new HTTPException(400, {
        message: 'insufficient balance',
      });
    }

    if (account.accountName === dofAccount.accountName) {
      throw new HTTPException(400, {
        message: 'account is same',
      });
    }

    const inquiryKey = Generator.genString(16);

    await prisma.transactionInquiry.create({
      data: {
        id: uuidv4(),
        inquiryKey: inquiryKey,
        senderId: account.accountName,
        receiverId: dofAccount.accountName,
        amount: req.amount,
        expiredAt: new Date(Date.now() + 60 * 60),
      },
    });
    return {
      inquiryKey,
    };
  }
}
