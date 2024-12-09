import { prisma } from '../client/prisma';
import { v4 as uuidv4 } from 'uuid';
import { HTTPException } from 'hono/http-exception';
import { UserValidation } from '../validation/user';

export class PinService {
  static async setPin(accId: string, reqPin: string): Promise<void> {
    const request = UserValidation.Pin.parse(reqPin);

    const cekPin = await prisma.pin.count({
      where: { accountId: accId },
    });
    if (cekPin != 0) {
      throw new HTTPException(400, { message: 'sudah setup pin' });
    }
    request.pin = await Bun.password.hash(request.pin, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    await prisma.pin.create({
      data: { id: uuidv4(), accountId: accId, pin: request.pin },
    });
  }
  static async getPin(accId: string, reqPin: string): Promise<void> {
    const getPin = await prisma.pin.findUnique({
      where: { accountId: accId },
      select: { pin: true },
    });
    if (!getPin) {
      throw new HTTPException(404, { message: 'pin not found' });
    }

    const pinValid = await Bun.password.verify(reqPin, getPin.pin);
    if (!pinValid) {
      throw new HTTPException(404, { message: 'pin invalid' });
    }
  }
}
