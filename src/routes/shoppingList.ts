import express from "express";
import { deleteModel } from "../controllers/baseController";
import { addProductToShoppingList, createShoppingList, getShoppingList, getShoppingLists } from "../controllers/shoppingList";
import { authenticateUser, checkCompanyOwnership, checkUserModulePermission } from "../middlewares/auth";
import ShoppingListModel from "../models/shoppingList/model";
import { SystemModules } from "../types/system";
import { validateRequest } from "../validators";
import { addProductToShoppingListValidator } from "../validators/shoppingList";

const router = express.Router();

router.use(authenticateUser());
router.use(checkUserModulePermission(SystemModules.SHOPPING_LIST));

router.post(
  '/create',
  createShoppingList
);

router.get(
  '/',
  getShoppingLists
);

router.post(
  '/:shoppingListId/add-product',
  validateRequest(addProductToShoppingListValidator),
  checkCompanyOwnership(ShoppingListModel, 'shoppingListId', 'shoppingList'),
  addProductToShoppingList
);

router.get(
  '/:shoppingListId',
  checkCompanyOwnership(ShoppingListModel, 'shoppingListId', 'shoppingList'),
  getShoppingList
);

router.delete(
  '/:shoppingListId',
  checkCompanyOwnership(ShoppingListModel, 'shoppingListId', 'shoppingList'),
  deleteModel(ShoppingListModel, 'shoppingListId')
);

export default router;
