import { Request, Response } from "express";
import { DateTime } from "luxon";
import UserModel from "../models/user/model";
import { CreateUserRequest } from "../types/user";

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params?.userId;
  if (!userId) {
    return res.status(400).json({ success: false, error: `userId é obrigatório` });
  }

  try {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(403).json({ success: false, error: "Usuário não encontrado" });
    }
    await user.update({ isActive: false, deletedById: req.internalUser?.id, deletedAt: DateTime.now().toJSDate() });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createUser = async (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
  const { name, email, type } = req.body;
  const userId = req.internalUser?.id as number;
  try {
    const userCreated = await UserModel.create({
      name,
      email,
      type,
      isActive: true,
      createdById: userId,
      updatedById: userId,
    });
    const userResponse = userCreated.get();
    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Não foi possível criar este usuário',
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const response = await UserModel.findAll({
      where: { isActive: true }
    });
    const users = [];
    for (let i = 0; i < response.length; i++) {
      const user = response[i];
      users.push(user.get());
    }
    return res.status(200).json({
      success: true,
      data: {
        users: users
      }
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar os usuários'
    });
  }
};
