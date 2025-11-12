import express from "express";
import { deleteModel } from "../controllers/baseController";
import { createProduct, getProduct, getProducts } from "../controllers/product";
import { productImageUpload } from '../controllers/productImage';
import { authenticateUser, checkCompanyOwnership } from "../middlewares/auth";
import ProductModel from "../models/product/model";
import { validateRequest } from "../validators";
import { createProductValidator } from "../validators/product";

const router = express.Router();

router.use(authenticateUser());

router.delete(
  '/:productId',
  checkCompanyOwnership(ProductModel, 'productId', 'product'),
  deleteModel(ProductModel, 'productId')
);

router.get(
  '/:productId',
  checkCompanyOwnership(ProductModel, 'productId', 'product'),
  getProduct
);

// router.patch(
//   '/:productId',
//   checkCompanyOwnership(ProductModel, 'productId', 'product'),
//   patchProduct
// );

/**
 * @swagger
 * /api/companies/:companyId/products/:productId/image-upload:
 *   post:
 *     summary: Upload a product image
 *     tags: [Products]
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Missing file
 *       401:
 *         description: Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:productId/image-upload',
  checkCompanyOwnership(ProductModel, 'productId', 'product'),
  productImageUpload
);

router.post('/create', validateRequest(createProductValidator), createProduct);

router.get('/', getProducts);

export default router;
