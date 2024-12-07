export interface ITopUpReq {
  amount: number;
}

export interface ITopUpRes {
  snapUrl: string;
  orderId: string;
}
