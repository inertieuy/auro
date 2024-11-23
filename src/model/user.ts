export interface IUserCache {
  id: number;
  fullName: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
  email_verified_at: Date | null;
}

export interface IToken {
  token: string;
}
export interface IUserData {
  id: number;
  fullName: string;
  phone: string;
  userName: string;
}

export interface IUserRegisterReq {
  fullName: string;
  phone: string;
  email: string;
  userName: string;
  password: string;
}

export interface IUserRegisterRes {
  referenceId: string;
}
