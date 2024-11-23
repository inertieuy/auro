import { MiddlewareHandler } from 'hono';
import { Context } from 'hono';
import { UserService } from '../service/user';

// export const authMiddleware: MiddlewareHandler = async (c, next) => {
//   const token = c.req.header('authorization');
//
//   if (!token) {
//     return c.json({ error: 'No token provided' }, 400);
//   }
//   const user = await UserService.ValidateToken(token);
//   c.set('user', user);
//   await next();
// };
