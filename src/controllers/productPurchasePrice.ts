import { Request, Response } from "express";
import ProductPurchasePriceModel from "../models/productPurchasePrice/model";
import { CreateProductPurchasePriceRequest } from "../types/productPurchasePrice";

export const createProductPurchasePrice = async (req: Request<{}, {}, CreateProductPurchasePriceRequest>, res: Response) => {
  try {
    const { price, date = new Date() } = req.body;
    const productId = req.item?.id as number;
    const userId = req.internalUser?.id as number;
    const productPurchasePrice = await ProductPurchasePriceModel.create({
      price,
      productId,
      date,
      createdById: userId,
      updatedById: userId,
      isActive: true,
    });
    return res.status(201).json({
      success: true,
      data: {
        productPurchasePrice
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao criar preço do produto'
    });
  }
};

export const getProductPurchasePrices = async (req: Request, res: Response) => {
  try {
    const productId = req.params?.productId;
    const response = await ProductPurchasePriceModel.findAll({
      where: { productId, isActive: true },
      order: [['date', 'ASC']]
    });
    const productPurchasePrices = [];
    for (let i = 0; i < response.length; i++) {
      const pc = response[i];
      productPurchasePrices.push(pc.get());
    }
    return res.status(200).json({
      success: true,
      data: {
        product: req.item,
        productPurchasePrices
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao listar as preços do produto'
    });
  }
};
