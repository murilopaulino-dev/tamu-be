import express from "express";
import { deleteModel } from "../controllers/baseController";
import { createProductCategory, getProductCategories } from "../controllers/productCategory";
import { authenticateUser, checkCompanyOwnership } from "../middlewares/auth";
import ProductCategoryModel from "../models/productCategory/model";
import { validateRequest } from "../validators";
import { createProductCategoryValidator } from "../validators/productCategory";

const router = express.Router();

router.use(authenticateUser());

router.post('/create', validateRequest(createProductCategoryValidator), createProductCategory);

router.get('/', getProductCategories);

router.delete(
  '/:productCategoryId',
  checkCompanyOwnership(ProductCategoryModel, 'productCategoryId', 'productCategory'),
  deleteModel(ProductCategoryModel, 'productCategoryId')
);

export default router;
