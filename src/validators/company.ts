import { cnpj } from "cpf-cnpj-validator";
import { body } from "express-validator";
import CompanyModel from "../models/company/model";
import UserModel from "../models/user/model";
import { SystemModules } from "../types/system";
import { formatCNPJ } from "../utils/company";

export const createCompanyValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome da empresa é obrigatório')
    .isLength({ max: 128 }).withMessage('Nome deve conter menos de 128 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .isLength({ max: 128 }).withMessage('Email deve conter menos de 128 caracteres')
    .custom(async (value) => {
      const existingUser = await UserModel.findOne({ where: { email: value } });
      if (existingUser) throw new Error('E-mail já cadastrado');
      return true;
    }),

  body('cnpj')
    .trim()
    .notEmpty().withMessage('CNPJ é obrigatório')
    .custom(value => cnpj.isValid(value)).withMessage('CNPJ inválido')
    .custom(async (value) => {
      const existingCompany = await CompanyModel.findOne({
        where: { cnpj: formatCNPJ(value) }
      });
      if (existingCompany) throw new Error('CNPJ já cadastrado');
      return true;
    }),

  body('permissions')
    .custom((value) => {
      const modules = Object.values(SystemModules);
      if (!value || modules.some(m => value[m] === undefined || typeof value[m] !== "number")) {
        throw new Error('Preencha todas as permissões da empresa');
      }
      return true;
    }),
];

export const addInternalUserToCompanyValidator = [
  body('userId')
    .trim()
    .notEmpty().withMessage('userId é obrigatório'),
];
