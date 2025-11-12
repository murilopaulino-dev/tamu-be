export enum UserType {
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER',
};

export type User = {
  id: number;
  name: string;
  email: string;
  type: UserType;
  isActive: boolean;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  type: UserType;
};
