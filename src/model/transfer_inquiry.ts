export interface TransferInquiryReq {
  AccountNumber: string;
  Amount: string;
}

export interface TransferInquiryRes {
  InquiryKey: string;
}

export interface TransactionExecuteReq {
  InquiryKey: string;
}
