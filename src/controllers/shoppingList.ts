import { Request, Response } from "express";
import { DateTime } from "luxon";
import ProductModel from "../models/product/model";
import ShoppingListModel from "../models/shoppingList/model";
import ShoppingListProductsModel from "../models/shoppingListProducts/model";
import UserModel from "../models/user/model";
import { CreateShoppingListRequest, ShoppingListStatus } from "../types/shoppingList";
import { AddProductToShoppingListRequest } from "../types/shoppingListProduct";

export const createShoppingList = async (req: Request<{}, {}, CreateShoppingListRequest>, res: Response) => {
  try {
    const { name = `Lista de compras ${DateTime.now().setLocale('pt-BR').toFormat('dd LLL yyyy')}` } = req.body;
    const userId = req.internalUser?.id as number;
    const shoppingList = await ShoppingListModel.create({
      name,
      status: ShoppingListStatus.CREATED,
      isActive: true,
      companyId: req.company?.id as number,
      createdById: userId,
      updatedById: userId,
    });
    return res.status(201).json({
      success: true,
      data: {
        shoppingList
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao criar lista de compras'
    });
  }
};

export const addProductToShoppingList = async (req: Request<{}, {}, AddProductToShoppingListRequest>, res: Response) => {
  try {
    const { price, productId, quantity, quantityPurchased } = req.body;
    const userId = req.internalUser?.id as number;
    const shoppingListProduct = await ShoppingListProductsModel.create({
      price,
      productId,
      quantity,
      quantityPurchased,
      shoppingListId: req.shoppingList?.id as number,
      isActive: true,
      createdById: userId,
      updatedById: userId,
    });
    return res.status(201).json({
      success: true,
      data: {
        shoppingListProduct
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao adicionar produto à lista de compras'
    });
  }
};

export const getShoppingList = async (req: Request, res: Response) => {
  try {
    const shoppingListProducts = await ShoppingListProductsModel.findAll({
      where: {
        shoppingListId: req.shoppingList?.id,
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
        shoppingList: req.shoppingList,
        products: shoppingListProducts.map(slp => slp.get()),
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao retornar a lista de compras'
    });
  }
}

export const getShoppingLists = async (req: Request, res: Response) => {
  try {
    const shoppingLists = await ShoppingListModel.findAll({
      where: {
        companyId: req.company?.id,
        isActive: true,
      },
      include: [{
        model: UserModel,
        as: 'createdBy'
      }]
    });
    console.log('shoppingLists', shoppingLists)
    return res.status(201).json({
      success: true,
      data: {
        shoppingLists: shoppingLists.map(sp => sp.get()),
      }
    });
  } catch (error) {
    console.log('error', error)
    return res.status(201).json({
      success: false,
      message: 'Erro ao retornar a lista de compras'
    });
  }
}
