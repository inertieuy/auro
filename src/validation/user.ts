import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    fullName: z.string().min(3).max(50),
    phone: z.string().min(10).max(20),
    email: z.string().min(10).max(20),
    userName: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
  });

  static readonly AUTH: ZodType = z.object({
    userName: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });
}
