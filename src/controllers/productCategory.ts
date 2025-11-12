import { Request, Response } from "express";
import CompanyModel from "../models/company/model";
import ProductCategoryModel from "../models/productCategory/model";
import { CreateProdcutCategoryRequest } from "../types/productCategory";

export const createProductCategory = async (req: Request<{}, {}, CreateProdcutCategoryRequest>, res: Response) => {
  const { name } = req.body;
  const userId = req.internalUser?.id as number;
  try {
    const productCategoryCreated = await ProductCategoryModel.create({
      name,
      isActive: true,
      companyId: req.company?.id as number,
      createdById: userId,
      updatedById: userId,
    });
    const productCategoryResponse = productCategoryCreated.get();
    return res.status(201).json({
      success: true,
      message: 'Categoria criada com sucesso',
      data: {
        productCategory: productCategoryResponse
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Não foi possível criar esta categoria',
    });
  }
};

export const getProductCategories = async (req: Request, res: Response) => {
  try {
    const response = await ProductCategoryModel.findAll({
      where: { companyId: req.company?.id, isActive: true },
      include: [
        { model: CompanyModel, as: 'company' },
      ]
    });
    const productCategories = [];
    for (let i = 0; i < response.length; i++) {
      const pc = response[i];
      productCategories.push(pc.get());
    }
    return res.status(201).json({
      success: true,
      data: {
        productCategories: productCategories
      }
    });
  } catch (error) {
    console.log('error', error);
    return res.status(201).json({
      success: false,
      message: 'Erro ao listar as categorias'
    });
  }
}
