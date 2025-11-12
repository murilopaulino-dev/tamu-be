
export type ShoppingListProducts = {
  id: number;
  price: number;
  quantity: number;
  quantityPurchased?: number;
  productId: number;
  shoppingListId: number;
};

export type AddProductToShoppingListRequest = {
  price: number;
  quantity: number;
  quantityPurchased?: number;
  productId: number;
};
