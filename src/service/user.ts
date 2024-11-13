import { prisma } from '../client';
import {
  IUserCache,
  IUserData,
  IUserRegisterReq,
  IUserRegisterRes,
} from '../model/user';
import { IValidateOtp } from '../model/validate_otp';
import { IAuthReq, IAuthRes } from '../model/auth';
import { HTTPException } from 'hono/dist/types/http-exception';
import { Generator } from '../util/generator';
import { UserValidation } from '../validation/user';

const cacheUser = new Map<string, any>();

class user {
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
      userCount.password,
      req.password,
    );
    if (!isPassValid) {
      throw new HTTPException(400, {
        message: 'credential not valid',
      });
    }

    const token = Generator.genString(16);

    cacheUser.set('user' + token, userCount);

    return {
      token: token,
    };
  }

  static async ValidateToken(token: string): Promise<IUserData> {
    const userCache: IUserCache = cacheUser.get('user' + token);
    if (!userCache) {
      throw new HTTPException(400, {
        message: 'user not found',
      });
    }
    const userData: IUserCache = userCache;

    return {
      id: userData.id,
      fullName: userData.fullName,
      phone: userData.phone,
      userName: userData.userName,
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

    request.password = Bun.password.hash(req.password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    const insert = await prisma.user.create({
      data: request,
    });

    const otpCode = Generator.genNumber(4);
    const referenceId = Generator.genString(16);

    cacheUser.set('otp' + referenceId, otpCode);
    cacheUser.set('user-ref' + referenceId, request.username);

    return {
      referenceId: referenceId,
    };
  }
  static async ValidateOtp(req: IValidateOtp): Promise<void> {
    const otp = String(cacheUser.get('otp' + req.referenceId));
    if (!otp) {
      throw new HTTPException(400, {
        message: 'otp not found',
      });
    }

    const value = String(cacheUser.get('user-ref' + req.referenceId));
    if (!value) {
      throw new HTTPException(400, {
        message: 'user-ref not found',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        userName: value,
      },
    });

    user!.email_verified_at = new Date();

    await prisma.user.update({
      where: {
        userName: value,
      },
      data: user!,
    });
  }
}
