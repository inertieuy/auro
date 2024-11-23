export interface ITransferInquiryReq {
  accountName: string;
  amount: number;
}

export interface ITransferInquiryRes {
  inquiryKey: string;
}

export interface ITransactionExecuteReq {
  inquiryKey: string;
}
