export type GeneralInventoryProduct = {
  id: number;
  quantity: number;
  minQuantityAlert?: number;
  productId: number;
  generalInventoryId: number;
  isActive: boolean;
  createdById: number;
  updatedById: number;
};

export type AddProductToGeneralInventoryRequest = {
  quantity: number;
  minQuantityAlert?: number;
  productId: number;
};
