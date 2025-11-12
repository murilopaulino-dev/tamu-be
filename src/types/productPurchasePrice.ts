
export type ProductPurchasePrice = {
  id: number;
  price: number;
  date: Date;
  productId: number;
}

export type CreateProductPurchasePriceRequest = {
  price: number;
  date?: Date;
}