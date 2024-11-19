import { prisma } from '../client/prisma';
import {
  IUserCache,
  IUserData,
  IUserRegisterReq,
  IUserRegisterRes,
} from '../model/user';
import { IValidateOtpReq } from '../model/validate_otp';
import { IAuthReq, IAuthRes } from '../model/auth';
import { HTTPException } from 'hono/http-exception';
import { Generator } from '../util/generator';
import { UserValidation } from '../validation/user';

export class UserService {
  static async Authenticate(req: IAuthReq): Promise<IAuthRes> {
    const auth = UserValidation.AUTH.parse(req);

    const userCount = await prisma.user.findUnique({
      where: {
        userName: auth.userName,
      },
    });
    if (!userCount) {
      throw new HTTPException(400, {
        message: 'user not found',
      });
    }

    if (!userCount.email_verified_at) {
      throw new HTTPException(400, {
        message: 'please verified email',
      });
    }

    const isPassValid = await Bun.password.verify(
      req.password,
      userCount.password,
    );

    if (!isPassValid) {
      throw new HTTPException(400, {
        message: 'credential not valid',
      });
    }

    const token = Generator.genString(16);

    // await client.set('user' + token, userCount);

    return {
      token: token,
    };
  }

  static async ValidateToken(token: string): Promise<IUserData> {
    // const userCache: IUserCache = await client.get('user' + token);
    // if (!userCache) {
    //   throw new HTTPException(400, {
    //     message: 'user not found',
    //   });
    // }
    // const userData: IUserCache = userCache;
    //
    // return {
    //   id: userData.id,
    //   fullName: userData.fullName,
    //   phone: userData.phone,
    //   userName: userData.userName,
    // };
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

    request.password = await Bun.password.hash(req.password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    const insert = await prisma.user.create({
      data: request,
    });

    const otpCode = Generator.genNumber(4);
    const referenceId = Generator.genString(16);

    // console.log('Saving OTP to cache:', 'otp' + referenceId, otpCode);
    // console.log(
    //   'Saving user-ref to cache:',
    //   'user-ref' + referenceId,
    //   request.userName,
    // );
    // await client.set('otp' + referenceId, otpCode, { expires: 600 });
    // await client.set('user-ref' + referenceId, request.userName, {
    //   expires: 600,
    // });

    otpStore.set(referenceId, {
      userName: request.userName,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 60 * 1000),
    });

    console.log(`OTP for ${referenceId} is ${otpCode}`);
    console.log('Saved to Map:', referenceId, otpStore.get(referenceId));

    return {
      referenceId: referenceId,
    };
  }
  static async ValidateOtp(req: IValidateOtpReq): Promise<void> {
    // const otp = await client.get('otp' + req.referenceId);
    // if (!otp) {
    //   throw new HTTPException(400, {
    //     message: 'otp not found',
    //   });
    // }
    //
    // const value = await client.get('user-ref' + req.referenceId);
    // if (!value) {
    //   throw new HTTPException(400, {
    //     message: 'user-ref not found',
    //   });
    // }

    if (!otpRecord) {
      throw new HTTPException(400, {
        message: 'otp not found',
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new HTTPException(400, {
        message: 'expiresAt exceeded',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        userName: otpRecord.userName,
      },
    });
    if (!user) {
      throw new HTTPException(404, {
        message: 'User not found',
      });
    }

    await prisma.user.update({
      where: {
        userName: otpRecord.userName,
      },
      data: {
        email_verified_at: new Date(),
      },
    });
    otpStore.delete(req.referenceId);
  }
}
