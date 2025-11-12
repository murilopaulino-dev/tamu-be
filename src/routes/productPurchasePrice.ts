import express from "express";
import { deleteModel } from "../controllers/baseController";
import { createProductPurchasePrice, getProductPurchasePrices } from "../controllers/productPurchasePrice";
import { authenticateUser, checkCompanyOwnership } from "../middlewares/auth";
import ProductModel from "../models/product/model";
import ProductPurchasePriceModel from "../models/productPurchasePrice/model";
import { validateRequest } from "../validators";
import { createProductPurchasePriceValidator } from "../validators/productPurchasePrice";

const router = express.Router();

router.use(authenticateUser());

router.post(
  '/:productId/create',
  validateRequest(createProductPurchasePriceValidator),
  checkCompanyOwnership(ProductModel, 'productId', 'product'),
  createProductPurchasePrice
);

router.get(
  '/:productId',
  checkCompanyOwnership(ProductModel, 'productId', 'product'),
  getProductPurchasePrices
);

router.delete(
  '/:productPurchasePriceId',
  checkCompanyOwnership(ProductPurchasePriceModel, 'productPurchasePriceId', 'productPurchasePrice'),
  deleteModel(ProductPurchasePriceModel, 'productPurchasePriceId')
);

export default router;
