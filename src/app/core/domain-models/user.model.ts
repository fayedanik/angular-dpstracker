export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  createdAt?: Date | string | null;
  isActive: boolean;
  activationDate: Date;
}
