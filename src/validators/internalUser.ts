import { body } from "express-validator";
import UserModel from "../models/user/model";

export const signUpValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome do usuário é obrigatório')
    .isLength({ max: 128 }).withMessage('Nome deve conter menos de 128 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .isLength({ max: 128 }).withMessage('Email deve conter menos de 128 caracteres')
    .custom(async (value) => {
      const existingUser = await UserModel.findOne({ where: { email: value } });
      if (existingUser) throw new Error('E-mail já cadastrado');
      return true
    }),

  body('password')
    .trim()
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 8, max: 128 }).withMessage('Senha deve conter entre 8 e 128 caracteres'),

  body('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('As senhas não são iguais');
      }
      return true;
    }),
]