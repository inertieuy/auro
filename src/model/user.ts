export interface IAccounts {
  id: string;
  userId: string;
  accountName: string;
  balance: number;
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
