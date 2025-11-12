
export type ProductPurchasePrice = {
  id: number;
  price: number;
  date: Date;
  productId: number;
  createdById: number;
  updatedById: number;
}

export type CreateProductPurchasePriceRequest = {
  price: number;
  date?: Date;
}