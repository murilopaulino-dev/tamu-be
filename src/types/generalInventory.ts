export type GeneralInventory = {
  id: number;
  name: string;
  isActive: boolean;
  companyId: number;
  createdById: number;
  updatedById: number;
};

export type CreateGeneralInventoryRequest = {
  name?: string;
};
