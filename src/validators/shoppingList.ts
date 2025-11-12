import { body } from "express-validator";
import ShoppingListProductsModel from "../models/shoppingListProducts/model";

export const addProductToShoppingListValidator = [
  body('price')
    .trim()
    .notEmpty().withMessage('Preço é obrigatório')
    .isDecimal().withMessage('Preço deve ser um número'),

  body('quantity')
    .trim()
    .notEmpty().withMessage('Quantidade é obrigatória')
    .isDecimal().withMessage('Quantidade deve ser um número'),

  body('quantityPurchased')
    .trim()
    .optional()
    .isDecimal().withMessage('Quantidade comprada deve ser um número'),

  body('productId')
    .custom(async (value, { req }) => {
      const shoppingListProduct = await ShoppingListProductsModel.findOne({ where: { shoppingListId: req.params?.shoppingListId, productId: value } });
      if (shoppingListProduct) throw new Error('Produto já adicionado');
      return true;
    })
];
