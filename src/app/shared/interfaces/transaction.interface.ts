export interface ITransaction {
  id: string;
  sourceAc: string;
  destAc: string;
  amount: number;
  note: string;
  paymentType: string;
  transactionType: string;
  dpsId: string;
  transactionNo: string;
  transactionDate: Date | string;
  status: string;
}
