import express from "express";
import { deleteModel } from "../controllers/baseController";
import { createProductCategory, getProductCategories } from "../controllers/productCategory";
import ProductCategoryModel from "../models/productCategory/model";
import { validateRequest } from "../validators";
import { createProductCategoryValidator } from "../validators/productCategory";

const router = express.Router();

router.post('/create', validateRequest(createProductCategoryValidator), createProductCategory);

router.get('/', getProductCategories);

router.delete(
  '/:productCategoryId',
  deleteModel(ProductCategoryModel, 'productCategoryId')
);

export default router;
