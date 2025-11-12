export type GeneralInventory = {
  id: number;
  name: string;
  isActive: boolean;
  createdById: number;
  updatedById: number;
};

export type CreateGeneralInventoryRequest = {
  name?: string;
};
