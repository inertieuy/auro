import { Context } from 'hono';
import { TopUpService } from '../service/topup';
import { HTTPException } from 'hono/http-exception';
import { ITopUpReq } from '../model/topup';

export class TopupHandler {
  static async initializeTopUp(c: Context) {
    try {
      const accId = c.get('jwtPayload');
      const req: ITopUpReq = await c.req.json();

      if (Number(req.amount) <= 0) {
        throw new HTTPException(400, { message: 'Invalid amount' });
      }

      const res = await TopUpService.InitializeTopUp(req, accId.id);

      await TopUpService.ConfirmedTopUp(res.orderId);
      return c.json({ res }, 200);
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
