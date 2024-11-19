export interface ITransferInquiryReq {
  accountNumber: string;
  amount: string;
}

export interface ITransferInquiryRes {
  inquiryKey: string;
}

export interface ITransactionExecuteReq {
  inquiryKey: string;
}
