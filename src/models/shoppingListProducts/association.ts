import { createInternalUserModelAssociantion } from "../BaseModel";
import ProductModel from "../product/model";
import ShoppingListModel from "../shoppingList/model";
import ShoppingListProductsModel from "./model";

createInternalUserModelAssociantion(ShoppingListProductsModel);

// PRODUCT
ShoppingListModel.belongsToMany(ProductModel, {
  through: ShoppingListProductsModel,
  foreignKey: 'shoppingListId',
  as: 'products'
});

ShoppingListProductsModel.belongsTo(ProductModel, {
  foreignKey: 'productId',
  as: 'product',
});

// SHOPPING LIST
ProductModel.belongsToMany(ShoppingListModel, {
  through: ShoppingListProductsModel,
  foreignKey: 'productId',
  as: 'shoppingLists'
});

ShoppingListProductsModel.belongsTo(ShoppingListModel, {
  foreignKey: 'shoppingListId',
  as: 'shoppingList',
});
