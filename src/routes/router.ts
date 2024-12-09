import { Hono } from 'hono';
import { UserHandler } from '../handler/user';
import { TransactionHandler } from '../handler/transaction';
import { SSENotification } from '../sse/notification';
import { TopupHandler } from '../handler/topup';
// import { MidtransHandler } from '../handler/midtrans';
import { PinHandler } from '../handler/pin';

import { jwt } from 'hono/jwt';

const app = new Hono();

app.post('user/register', UserHandler.registerUser);
app.post('user/validate-otp', UserHandler.validateOTP);
app.post('token/generate', UserHandler.generateToken);

app.use(
  '/users/*',
  jwt({
    secret: Bun.env.JWT_SECRET as string,
  }),
);
app.post('/users/setPin', PinHandler.setPin);

app.get('/users/check', UserHandler.hello);
app.put('/users/notification/:notificationId', UserHandler.readNotification);

app.post('/users/transaction/inquiry', TransactionHandler.transactionInquiry);
app.post('/users/transaction/execute', TransactionHandler.transactionExecute);

app.get('/users/sse/notification-stream', SSENotification.streamNotification);

app.post('/users/topup/initialize', TopupHandler.initializeTopUp);
// app.post(
//   '/midtrans/payment-callback',
//   MidtransHandler.paymentHandlerNotification,
// );

export default app;
