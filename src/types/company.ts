import { SystemModules } from "./system";

export type Company = {
  id: number;
  name: string;
  email: string;
  cnpj: string;
};

export type CreateCompanyRequest = Pick<Company, 'name' | 'email' | 'cnpj'> & {
  permissions: {
    [K in SystemModules]: number;
  }
};
