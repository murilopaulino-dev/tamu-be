
export type ShoppingListProducts = {
  id: number;
  price: number;
  quantity: number;
  quantityPurchased?: number;
  isActive: boolean;
  productId: number;
  shoppingListId: number;
  createdById: number;
  updatedById: number;
};

export type AddProductToShoppingListRequest = {
  price: number;
  quantity: number;
  quantityPurchased?: number;
  productId: number;
};
