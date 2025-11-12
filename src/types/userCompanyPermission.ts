import { SystemModules } from "./system";

export type UserCompanyPermission = {
  id: number;
  userId: number;
  companyId: number;
} & {
  [key in SystemModules]: boolean;
};