import { Context } from 'hono';
import { IAuthReq } from '../model/auth';
import { UserService } from '../service/user';
import { IUserRegisterReq } from '../model/user';
import { IValidateOtpReq } from '../model/validate_otp';
import { HTTPException } from 'hono/http-exception';

export class UserHandler {
  static async generateToken(c: Context) {
    try {
      const req: IAuthReq = await c.req.json();

      const token = await UserService.authenticate(req);
      if (!token) {
        return c.json(
          {
            error: 'unauthorized',
          },
          400,
        );
      }
      return c.json({ token }, 200);
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

  static async registerUser(c: Context) {
    try {
      const req: IUserRegisterReq = await c.req.json();

      const user = await UserService.register(req);

      return c.json({ user }, 200);
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
  static async validateOTP(c: Context) {
    try {
      const req: IValidateOtpReq = await c.req.json();

      await UserService.validateOtp(req);

      return c.json(
        {
          message: 'OTP registered',
        },
        200,
      );
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

  static async hello(c: Context) {
    const payload = c.get('jwtPayload');
    return c.json({ payload }, 200);
  }

  static async readNotification(c: Context) {
    try {
      const { notificationId } = c.req.param();
      const payload = c.get('jwtPayload');

      await UserService.readNotification(notificationId, payload.id);

      return c.json({ message: 'notification sudah dibaca' }, 200);
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
