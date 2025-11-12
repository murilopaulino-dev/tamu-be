import express from "express";
import { deleteModel } from "../controllers/baseController";
import { addProductToShoppingList, createShoppingList, getShoppingList, getShoppingLists, getUserShoppingLists } from "../controllers/shoppingList";
import ShoppingListModel from "../models/shoppingList/model";
import { validateRequest } from "../validators";
import { addProductToShoppingListValidator } from "../validators/shoppingList";

const router = express.Router();

router.post(
  '/create',
  createShoppingList
);

router.get(
  '/',
  getShoppingLists
);

router.get(
  '/from-user',
  getUserShoppingLists
);

router.post(
  '/:shoppingListId/add-product',
  validateRequest(addProductToShoppingListValidator),
  addProductToShoppingList
);

router.get(
  '/:shoppingListId',
  getShoppingList
);

router.delete(
  '/:shoppingListId',
  deleteModel(ShoppingListModel, 'shoppingListId')
);

export default router;
