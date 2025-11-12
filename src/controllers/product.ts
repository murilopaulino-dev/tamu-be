import { Request, Response } from "express";
import sequelize from "../config/database";
import ProductModel from "../models/product/model";
import ProductCategoryModel from "../models/productCategory/model";
import ProductPurchasePriceModel from "../models/productPurchasePrice/model";
import { CreateProductRequest } from "../types/product";

export const createProduct = async (req: Request<{}, {}, CreateProductRequest>, res: Response) => {
  const transaction = await sequelize.transaction();
  const { name, basePrice, barCode, categoryId, code, purchasePrice, unitType } = req.body;
  const userId = req.internalUser?.id as number;
  try {
    const productCreated = await ProductModel.create({
      name,
      code,
      basePrice,
      barCode,
      categoryId,
      unitType,
      isActive: true,
      createdById: userId,
      updatedById: userId,
    }, { transaction });
    const productResponse = productCreated.get();

    if (purchasePrice) {
      await ProductPurchasePriceModel.create({
        date: productCreated.createdAt,
        productId: productCreated.id,
        price: purchasePrice,
        createdById: userId,
        updatedById: userId,
        isActive: true
      }, { transaction });
    }

    await transaction.commit();
    return res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: {
        product: productResponse
      }
    });
  } catch (error) {
    console.log('error', error)
    await transaction.rollback();
    return res.status(400).json({
      success: false,
      message: 'Não foi possível criar este produto',
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    return res.status(201).json({
      success: true,
      data: {
        product: req.product,
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao retornar Produto'
    });
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.findAll({
      where: { isActive: true },
      attributes: ['id', 'name'],
      include: [
        { model: ProductCategoryModel, as: 'category' },
      ]
    });

    return res.status(200).json({
      success: true,
      data: {
        products,
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(400).json({
      succes: false,
      message: 'Erro ao listar produtos'
    });
  }
}
