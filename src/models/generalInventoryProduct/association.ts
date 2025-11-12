import { createInternalUserModelAssociantion } from "../BaseModel";
import GeneralInventoryModel from "../generalInventory/model";
import ProductModel from "../product/model";
import GeneralInventoryProductModel from "./model";

GeneralInventoryModel.belongsToMany(ProductModel, {
  through: GeneralInventoryProductModel,
  foreignKey: 'generalInventoryId',
  as: 'generalInventory',
});

ProductModel.belongsToMany(GeneralInventoryModel, {
  through: GeneralInventoryProductModel,
  foreignKey: 'productId',
  as: 'product',
});

GeneralInventoryProductModel.belongsTo(ProductModel, {
  foreignKey: 'productId',
  as: 'product',
});

createInternalUserModelAssociantion(GeneralInventoryProductModel);

