import { body } from "express-validator";

export const createProductCategoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório'),
];