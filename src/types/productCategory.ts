import { Company } from "./company";

export type ProductCategory = {
  id: number;
  name: string;
  createdById: number;
  updatedById: number;
  isActive: boolean;
  companyId: number;
  company?: Company;
};

export type CreateProdcutCategoryRequest = {
  name: string;
};
