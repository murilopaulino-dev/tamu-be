import { createInternalUserModelAssociantion } from "../BaseModel";
import ProductModel from "../product/model";
import ProductCategoryModel from "./model";

// PRODUCT
ProductModel.belongsTo(ProductCategoryModel, {
  foreignKey: 'categoryId',
  as: 'category',
});

ProductCategoryModel.hasMany(ProductModel, {
  foreignKey: 'categoryId',
  as: 'products',
});

createInternalUserModelAssociantion(ProductCategoryModel);

