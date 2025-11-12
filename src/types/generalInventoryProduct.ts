export type GeneralInventoryProduct = {
  id: number;
  quantity: number;
  minQuantityAlert?: number;
  productId: number;
  generalInventoryId: number;
};

export type AddProductToGeneralInventoryRequest = {
  quantity: number;
  minQuantityAlert?: number;
  productId: number;
};
