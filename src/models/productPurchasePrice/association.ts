import { createInternalUserModelAssociantion } from "../BaseModel";
import ProductModel from "../product/model";
import ProductPurchasePriceModel from "./model";

// PRODUCT
ProductPurchasePriceModel.belongsTo(ProductModel, {
  foreignKey: 'productId',
  as: 'product'
});

ProductModel.hasMany(ProductPurchasePriceModel, {
  foreignKey: 'productId',
  as: 'purchasePrices'
});

createInternalUserModelAssociantion(ProductPurchasePriceModel);
