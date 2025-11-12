export enum ShoppingListStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
};

export type ShoppingList = {
  id: number;
  name: string;
  status: ShoppingListStatus;
  companyId: number;
};

export type CreateShoppingListRequest = {
  name?: string;
};
