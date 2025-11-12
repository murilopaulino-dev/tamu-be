import { body } from "express-validator";

export const createProductPurchasePriceValidator = [
  body('price')
    .trim()
    .notEmpty().withMessage('Preço é obrigatório')
    .isDecimal().withMessage('Preço deve ser um número'),

  body('date')
    .trim()
    .optional()
    .isISO8601().withMessage('Data inválida'),
];
