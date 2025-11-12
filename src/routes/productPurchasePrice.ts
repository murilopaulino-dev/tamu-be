import express from "express";
import { deleteModel } from "../controllers/baseController";
import { createProductPurchasePrice, getProductPurchasePrices } from "../controllers/productPurchasePrice";
import ProductPurchasePriceModel from "../models/productPurchasePrice/model";
import { validateRequest } from "../validators";
import { createProductPurchasePriceValidator } from "../validators/productPurchasePrice";

const router = express.Router();

router.post('/:productId/create', validateRequest(createProductPurchasePriceValidator), createProductPurchasePrice);

router.get('/:productId', getProductPurchasePrices);

router.delete(
  '/:productPurchasePriceId',
  deleteModel(ProductPurchasePriceModel, 'productPurchasePriceId')
);

export default router;
