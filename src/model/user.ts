export interface UserData {
  Id: Number;
  FullName: string;
  Phone: String;
  Username: string;
}

export interface UserRegisterReq {
  FullName: string;
  Phone: string;
  Email: string;
  Username: string;
  Password: string;
}

export interface UserRegisterRes {
  ReferenceId: string;
}
