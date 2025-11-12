import { createInternalUserModelAssociantion } from "../BaseModel";
import UserModel from "../user/model";
import ShoppingListModel from "./model";

// USER 
createInternalUserModelAssociantion(ShoppingListModel);

UserModel.hasMany(ShoppingListModel, {
  foreignKey: 'createdById',
  as: 'shoppingLists'
});
