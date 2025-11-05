export interface IDps {
  id: string;
  dpsName: string;
  accountNo: string;
  monthlyAmount: number;
  durationMonths: number;
  startDate: Date | string;
  maturityDate: Date | string;
  interestRate: number;
  dpsOwners: {
    userId: string;
    displayName: string;
  }[];
}
