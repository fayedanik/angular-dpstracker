export interface ITransferMoneyPayload {
  sourceAc: string;
  beneficiaryAc: string;
  amount: number;
  transactionNumber: string;
  transactionDate: Date | string;
  note: string;
}
