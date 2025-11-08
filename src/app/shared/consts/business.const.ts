export const BusinessConst = {
  pageLimit: 100,
};

export const accountType = [
  {
    label: 'Personal',
    value: 'personal',
  },
  {
    label: 'Joint',
    value: 'joint',
  },
];

export const paymentType = [
  {
    label: 'DPS',
    value: 'dps',
  },
  {
    label: 'Others',
    value: 'others',
  },
];

export enum TransactionTypeEnum {
  TransferMoney = 'transfermoney',
  Payment = 'payment',
}

export const Role = {
  Admin: 'admin',
  User: 'user',
  Anonymous: 'anonymous',
};
