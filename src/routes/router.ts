import { Hono } from 'hono';
import { UserHandler } from '../handler/user';
import { TransactionHandler } from '../handler/transaction';
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
app.get('/users/page', (c) => {
  const payload = c.get('jwtPayload');
  return c.json({ payload });
});
app.get('/users/hello', UserHandler.hello);
app.post('/users/transfer', TransactionHandler.TransferCek);
export default app;
