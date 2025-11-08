export interface IMakePaymentPayload {
  sourceAc: string;
  paymentType: string;
  dpsId: string;
  amount: number;
  transactionNumber: string;
  paymentDate: Date | string;
  note: string;
}
