import { Context } from 'hono';
import { TransactionService } from '../service/transaction';

export class TransactionHandler {
  static async TransferCek(c: Context) {
    const jwtPayload = c.get('jwtPayload');
    console.log('JWT Payload:', jwtPayload);
    const req = await c.req.json();

    const tx = await TransactionService.TransferInquiry(jwtPayload, req);
    return c.json({ tx }, 200);
  }
}
