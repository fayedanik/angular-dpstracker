export interface IAddUpdateBankAccountPayload {
  id?: string;
  accountNo: string;
  bankName: string;
  bankId: string;
  branchName: string;
  branchId: string;
  accountType: string;
  userIds: string[];
}
