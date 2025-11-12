import express from "express";
import { deleteModel } from "../controllers/baseController";
import { addProductToGeneralInventory, createGeneralInventory, getGeneralInventories, getGeneralInventory } from "../controllers/generalInventory";
import { authenticateUser, checkCompanyOwnership, checkUserModulePermission } from "../middlewares/auth";
import GeneralInventoryModel from "../models/generalInventory/model";
import { SystemModules } from "../types/system";
import { validateRequest } from "../validators";
import { addProductToGeneralInventoryValidator } from "../validators/generalInventory";

const router = express.Router();

router.use(authenticateUser());
router.use(checkUserModulePermission(SystemModules.GENERAL_INVENTORY));

router.post('/create', createGeneralInventory);

router.get('/', getGeneralInventories);

router.post(
  '/:generalInventoryId/add-product',
  validateRequest(addProductToGeneralInventoryValidator),
  checkCompanyOwnership(GeneralInventoryModel, 'generalInventoryId', 'generalInventory'),
  addProductToGeneralInventory
);

router.get(
  '/:generalInventoryId',
  checkCompanyOwnership(GeneralInventoryModel, 'generalInventoryId', 'generalInventory'),
  getGeneralInventory
);

router.delete(
  '/:generalInventoryId',
  checkCompanyOwnership(GeneralInventoryModel, 'generalInventoryId', 'generalInventory'),
  deleteModel(GeneralInventoryModel, 'generalInventoryId')
);

export default router;
