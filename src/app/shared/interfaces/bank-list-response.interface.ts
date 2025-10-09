export interface IBankListResponse {
  name: string;
  bank_code: string;
  districts: IBankDistrictInfo[];
}
export interface IBankDistrictInfo {
  district_name: string;
  branches: IBranchInfo[];
}
export interface IBranchInfo {
  routing_number: string;
  swiftCode: string;
  branch_name: string;
}
