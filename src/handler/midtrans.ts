import { Context } from 'hono';
import { MidtransService } from '../service/midtrans';
import { TopUpService } from '../service/topup';
import { HTTPException } from 'hono/http-exception';

// export class MidtransHandler {
//   static async paymentHandlerNotification(c: Context) {
//     try {
//       const req = await c.req.json();
//
//       const success = await MidtransService.verifyPayment(req.orderid);
//       if (success) {
//         await TopUpService.ConfirmedTopUp(req);
//       }
//
//       return c.json({ message: success }, 200);
//     } catch (err) {
//       console.error(err);
//       if (err instanceof HTTPException) {
//         const { status, message } = err;
//         return c.json(
//           {
//             error: message || 'An error occurred',
//           },
//           status || 400,
//         );
//       }
//     }
//   }
// }
