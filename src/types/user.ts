export enum UserType {
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER',
};

export type User = {
  id: number;
  name: string;
  email: string;
  type: UserType;
  companyId: number;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  companyId: number;
  type: UserType;
};
