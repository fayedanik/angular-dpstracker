export interface IAddDpsPayload {
  dpsName: string;
  accountNumber: string;
  monthlyDeposit: number;
  durationMonths: number;
  startDate: string;
  maturityDate: string;
  interestRate: number;
  dpsOwners: string[];
}
