import { Context } from 'hono';
import { TransactionService } from '../service/transaction';

export class TransactionHandler {
  static async TransactionInquiry(c: Context) {
    const jwtPayload = c.get('jwtPayload');
    console.log('JWT Payload:', jwtPayload);
    const req = await c.req.json();

    const tx = await TransactionService.TransactionInquiry(jwtPayload, req);
    return c.json({ tx }, 200);
  }
}
