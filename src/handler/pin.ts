import { Context } from 'hono';
import { PinService } from '../service/pin';
import { HTTPException } from 'hono/http-exception';

export class PinHandler {
  static async setPin(c: Context) {
    try {
      const payload = c.get('jwtPayload');
      const reqPin = await c.req.json();

      await PinService.setPin(payload.id, reqPin);

      return c.json({ message: 'pin berhasl didaftarkan' }, 200);
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
