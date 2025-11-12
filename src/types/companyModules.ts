import { SystemModules } from "./system";

export type CompanyModules = {
  id: number;
} & {
  [key in SystemModules]: number;
};
