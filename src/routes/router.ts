import { Hono } from 'hono';
import { UserHandler } from '../handler/user';
import { authMiddleware } from '../middleware/auth';

const app = new Hono();

app.post('token/generate', UserHandler.generateToken);
app.get('token/validate', authMiddleware, UserHandler.validateToken);
app.post('user/validate-otp', UserHandler.validateOTP);
app.post('user/register', UserHandler.registerUser);

export default app;
