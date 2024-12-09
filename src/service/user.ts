import { prisma } from '../client/prisma';
import { IUserRegisterReq, IUserRegisterRes } from '../model/user';
import { IValidateOtpReq } from '../model/validate_otp';
import { IAuthReq, IAuthRes } from '../model/auth';
import { HTTPException } from 'hono/http-exception';
import { Generator } from '../util/generator';
import { UserValidation } from '../validation/user';
import { sign } from 'hono/jwt';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  static async authenticate(req: IAuthReq): Promise<IAuthRes> {
    const auth = UserValidation.AUTH.parse(req);

    const userCount = await prisma.user.findUnique({
      where: {
        userName: auth.userName,
      },
    });
    if (!userCount) {
      throw new HTTPException(404, {
        message: 'user not found',
      });
    }

    if (!userCount.email_verified_at) {
      throw new HTTPException(400, {
        message: 'please verified email',
      });
    }

    const isPassValid = await Bun.password.verify(
      auth.password,
      userCount.password,
    );

    if (!isPassValid) {
      throw new HTTPException(400, {
        message: 'credential not valid',
      });
    }

    const accFind = await prisma.accounts.findUnique({
      where: {
        userId: userCount.id,
      },
    });
    if (!accFind) {
      throw new HTTPException(404, {
        message: 'account not found',
      });
    }
    const secret = (await Bun.env.JWT_SECRET) as string;

    const token = await sign(
      {
        id: accFind.id,
        userName: userCount.userName,
        exp: Math.floor(Date.now() / 1000 + 60 * 60 * 5),
      },
      secret,
      'HS256',
    );

    return {
      token: token,
    };
  }

  static async register(req: IUserRegisterReq): Promise<IUserRegisterRes> {
    const request = UserValidation.REGISTER.parse(req);

    const exist = await prisma.user.count({
      where: {
        userName: request.userName,
      },
    });
    if (exist != 0) {
      throw new HTTPException(400, {
        message: 'username already exists',
      });
    }

    request.id = uuidv4();
    request.password = await Bun.password.hash(request.password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    await prisma.user.create({
      data: request,
    });

    const otpCode = Generator.genNumber(4);
    const referenceId = Generator.genString(16);

    await prisma.oTP.create({
      data: {
        id: referenceId,
        accountName: request.userName,
        otp: otpCode,
        expiredAt: new Date(Date.now() + 60 * 1000),
      },
    });

    console.log(`OTP for ${referenceId} is ${otpCode}`);

    return {
      referenceId: referenceId,
    };
  }

  static async validateOtp(req: IValidateOtpReq): Promise<void> {
    const otpRecord = await prisma.oTP.findUnique({
      where: {
        id: req.referenceId,
      },
    });
    if (!otpRecord) {
      throw new HTTPException(404, {
        message: 'otp not found',
      });
    }

    if (new Date() >= otpRecord.expiredAt) {
      throw new HTTPException(400, {
        message: 'otp expired',
      });
    }

    if (otpRecord.otp !== req.otp) {
      throw new HTTPException(400, {
        message: 'otp invalid',
      });
    }

    const user = await prisma.user.update({
      where: {
        userName: otpRecord.accountName,
      },
      data: {
        email_verified_at: new Date(),
      },
    });

    await prisma.accounts.create({
      data: {
        userId: user.id,
        accountName: user.userName,
        balance: 0,
      },
    });
    await prisma.oTP.delete({
      where: {
        id: req.referenceId,
      },
    });
    console.log(`OTP for ${req.referenceId} has been validated and deleted.`);
  }

  static async readNotification(
    notificationId: string,
    accId: string,
  ): Promise<void> {
    const findNotif = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        accountId: accId,
      },
    });
    if (!findNotif) {
      throw new HTTPException(404, {
        message: 'notification not found',
      });
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: 1,
      },
    });
  }
}
