import { body } from "express-validator";
import ProductCategoryModel from "../models/productCategory/model";

export const createProductValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório'),

  body('basePrice')
    .notEmpty().withMessage('Preço base é obrigatório')
    .isDecimal().withMessage('Preço base deve ser um número'),

  body('purchasePrice')
    .optional().isDecimal().withMessage('Preço de compra deve ser um número'),

  body('categoryId')
    .custom(async (value, { req }) => {
      if (!value) return true;
      const existingProductCategory = await ProductCategoryModel.findByPk(value);
      if (!existingProductCategory || existingProductCategory.companyId !== req.company?.id) throw new Error('Categoria não cadastrada');
      return true;
    }),
];