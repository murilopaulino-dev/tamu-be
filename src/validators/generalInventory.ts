import { body } from "express-validator";
import GeneralInventoryProductModel from "../models/generalInventoryProduct/model";

export const addProductToGeneralInventoryValidator = [

  body('quantity')
    .trim()
    .notEmpty().withMessage('Quantidade é obrigatória')
    .isDecimal().withMessage('Quantidade deve ser um número'),

  body('minQuantityAlert')
    .trim()
    .optional()
    .isDecimal().withMessage('Alerta de quantidade mínima deve ser um número'),

  body('productId')
    .custom(async (value, { req }) => {
      const generalInventoryProduct = await GeneralInventoryProductModel.findOne({ where: { generalInventoryId: req.params?.generalInventoryId, productId: value } });
      if (generalInventoryProduct) throw new Error('Produto já adicionado');
      return true;
    })
];