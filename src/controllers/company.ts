import { Request, Response } from 'express';
import sequelize from '../config/database';
import CompanyModel from '../models/company/model';
import CompanyModulesModel from '../models/companyModules/model';
import { CreateCompanyRequest } from '../types/company';
import { formatCNPJ } from '../utils/company';

export const getCompany = async (req: Request, res: Response) => {
  try {
    return {
      success: true,
      data: {
        company: req.company?.get(),
      }
    }
  } catch (error) {
    console.error('Error getting company:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while getting the company'
    });
  }
};

export const createCompany = async (req: Request<{}, {}, CreateCompanyRequest>, res: Response) => {
  const transaction = await sequelize.transaction();
  const { name, email, cnpj, permissions } = req.body;
  const userId = req.internalUser?.id as number;
  try {
    const company = await CompanyModel.create({
      name,
      email,
      cnpj: formatCNPJ(cnpj),
      isActive: true,
      createdById: userId,
      updatedById: userId,
    }, {
      transaction
    });

    const permissionsCreated = await CompanyModulesModel.create({
      ...permissions,
    }, { transaction });

    const companyResponse = {
      id: company.id,
      name: company.name,
      email: company.email,
      cnpj: company.cnpj,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
    await transaction.commit();
    return res.status(201).json({
      success: true,
      message: 'Empresa criada com sucesso',
      data: {
        company: companyResponse,
        permissions: permissionsCreated.get(),
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating company:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while creating the company'
    });
  }
};

export const getCompanyModules = async (req: Request, res: Response) => {
  try {
    const companiesModules = await CompanyModulesModel.findAll();
    const companyModules = companiesModules?.[0];
    return res.status(201).json({
      success: true,
      data: {
        modules: companyModules?.get(),
      }
    });
  } catch (error) {
    console.error('Error getting company modules:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while getting the company modules'
    });
  }
};

export const patchCompanyModules = async (req: Request, res: Response) => {
  try {
    // -- adicionar um company modules event, pra saber quando houve alteração e por quem
    // -- finalizar aqui
    // const companyModules = await CompanyModulesModel.findOne({
    //   where: { companyId: req.company?.id as number },
    // });
    // return res.status(201).json({
    //   success: true,
    //   data: {
    //     company: req.company?.get(),
    //     modules: companyModules?.get(),
    //   }
    // });
  } catch (error) {
    console.error('Error getting company modules:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while getting the company modules'
    });
  }
};
