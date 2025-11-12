import { Request, Response } from "express";
import { DateTime } from "luxon";
import GeneralInventoryModel from "../models/generalInventory/model";
import GeneralInventoryProductModel from "../models/generalInventoryProduct/model";
import ProductModel from "../models/product/model";
import UserModel from "../models/user/model";
import { CreateGeneralInventoryRequest } from "../types/generalInventory";
import { AddProductToGeneralInventoryRequest } from "../types/generalInventoryProduct";

export const createGeneralInventory = async (req: Request<{}, {}, CreateGeneralInventoryRequest>, res: Response) => {
  const { name = `Estoque geral ${DateTime.now().setLocale('pt-BR').toFormat('dd LLL yyyy')}` } = req.body;
  const userId = req.internalUser?.id as number;
  try {
    const generalInventory = await GeneralInventoryModel.create({
      name,
      isActive: true,
      createdById: userId,
      updatedById: userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Estoque geral criado com sucesso',
      data: {
        generalInventory: generalInventory.get()
      }
    });
  } catch (error) {
    console.error('Error creating general inventory:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while creating the general inventory'
    });
  }
};

export const addProductToGeneralInventory = async (req: Request<{}, {}, AddProductToGeneralInventoryRequest>, res: Response) => {
  try {
    const { productId, quantity, minQuantityAlert } = req.body;
    const userId = req.internalUser?.id as number;
    const generalInventoryProduct = await GeneralInventoryProductModel.create({
      productId,
      quantity,
      minQuantityAlert,
      generalInventoryId: req.generalInventory?.id as number,
      isActive: true,
      createdById: userId,
      updatedById: userId,
    });
    return res.status(201).json({
      success: true,
      data: {
        generalInventoryProduct
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao adicionar produto ao estoque geral'
    });
  }
};

export const getGeneralInventory = async (req: Request, res: Response) => {
  try {
    const generalInventoryProducts = await GeneralInventoryProductModel.findAll({
      where: {
        generalInventoryId: req.generalInventory?.id,
        isActive: true,
      },
      include: [{
        model: ProductModel,
        as: 'product'
      }]
    });
    return res.status(201).json({
      success: true,
      data: {
        generalInventory: req.generalInventory,
        products: generalInventoryProducts.map(gip => gip.get()),
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao retornar a estoque geral'
    });
  }
};

export const getGeneralInventories = async (req: Request, res: Response) => {
  try {
    const generalInventories = await GeneralInventoryModel.findAll({
      where: {
        isActive: true,
      },
      include: [{
        model: UserModel,
        as: 'createdBy'
      }]
    });
    return res.status(201).json({
      success: true,
      data: {
        generalInventories: generalInventories.map(gi => gi.get()),
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao retornar a estoques gerais'
    });
  }
};
