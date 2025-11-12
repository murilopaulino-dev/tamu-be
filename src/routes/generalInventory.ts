import express from "express";
import { deleteModel } from "../controllers/baseController";
import { addProductToGeneralInventory, createGeneralInventory, getGeneralInventories, getGeneralInventory } from "../controllers/generalInventory";
import GeneralInventoryModel from "../models/generalInventory/model";
import { validateRequest } from "../validators";
import { addProductToGeneralInventoryValidator } from "../validators/generalInventory";

const router = express.Router();

router.post('/create', createGeneralInventory);

router.get('/', getGeneralInventories);

router.post(
  '/:generalInventoryId/add-product',
  validateRequest(addProductToGeneralInventoryValidator),
  addProductToGeneralInventory
);

router.get(
  '/:generalInventoryId',
  getGeneralInventory
);

router.delete(
  '/:generalInventoryId',
  deleteModel(GeneralInventoryModel, 'generalInventoryId')
);

export default router;
