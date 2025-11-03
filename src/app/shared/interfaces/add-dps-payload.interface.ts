export interface IAddDpsPayload {
  accountNumber: string;
  monthlyDeposit: number;
  durationMonths: number;
  startDate: string;
  maturityDate: string;
  interestRate: number;
  dpsOwners: string[];
}
