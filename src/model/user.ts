export interface IAccounts {
  id: string;
  userId: string;
  accountName: string;
  balance: number;
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
