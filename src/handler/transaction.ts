import { Context } from 'hono';
import { TransactionService } from '../service/transaction';
import {
  ITransactionExecuteReq,
  ITransferInquiryReq,
} from '../model/transfer_inquiry';
import { HTTPException } from 'hono/http-exception';

export class TransactionHandler {
  static async transactionInquiry(c: Context) {
    try {
      const jwtPayload = c.get('jwtPayload');
      const req: ITransferInquiryReq = await c.req.json();

      const tx = await TransactionService.transactionInquiry(jwtPayload, req);
      return c.json({ tx }, 200);
    } catch (err) {
      console.error(err);
      if (err instanceof HTTPException) {
        const { status, message } = err;
        return c.json(
          {
            error: message || 'An error occurred',
          },
          status || 400,
        );
      }
    }
  }

  static async transactionExecute(c: Context) {
    try {
      const req: ITransactionExecuteReq = await c.req.json();

      await TransactionService.transactionExecute(req);
      return c.json({ message: 'transfer succesfully' }, 200);
    } catch (err) {
      console.error(err);

      if (err instanceof HTTPException) {
        const { status, message } = err;
        return c.json(
          {
            error: message || 'An error occurred',
          },
          status || 400,
        );
      }
    }
  }
}
