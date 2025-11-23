export interface IDps {
  id: string;
  dpsName: string;
  accountNo: string;
  monthlyAmount: number;
  totalDeposit: number;
  installmentDates: Date[];
  durationMonths: number;
  startDate: Date | string;
  maturityDate: Date | string;
  interestRate: number;
  dpsOwners: IDpsOwner[];
  canUpdate?: boolean;
  canDelete?: boolean;
}
export interface IDpsOwner {
  userId: string;
  displayName: string;
  installmentDates: Date[];
  amountPaid: number;
}
