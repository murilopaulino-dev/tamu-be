
export enum ProductUnitType {
  WEIGHT = "WEIGHT",
  UNIT = "UNIT",
  BOX = "BOX",
  PARCEL = "PARCEL",
  PACKAGE = "PACKAGE",
};

export type Product = {
  id: number;
  name: string;
  companyId: number;
  code?: string;
  barCode?: string;
  basePrice: number;
  unitType?: ProductUnitType;
  isActive: boolean;
  categoryId?: number;
  createdById: number;
  updatedById: number;
}

export type CreateProductRequest = {
  name: string;
  code?: string;
  barCode?: string;
  basePrice: number;
  categoryId?: number;
  purchasePrice?: number;
  unitType?: ProductUnitType;
};
