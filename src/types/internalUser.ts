export enum InternalUserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  POS = 'POS',
  SALESMAN = 'SALESMAN',
};

export type InternalUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: InternalUserRole;
};

export type LoginRequest = {
  code: string;
  password: string;
};

export type CreateInternalUserRequest = {
  name: string;
  email: string;
  password: string;
  role: InternalUserRole;
};
