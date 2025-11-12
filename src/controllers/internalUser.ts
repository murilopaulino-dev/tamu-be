import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { JWT_SECRET } from "../constants/auth";
import InternalUserModel from "../models/internalUser/model";
import { CreateInternalUserRequest, LoginRequest } from "../types/internalUser";

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { code, password } = req.body;

  try {
    const user = await InternalUserModel.findByPk(code);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Código e/ou senha inválido(s)' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Código e/ou senha inválido(s)' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      message: 'Login efetuado',
      data: {
        user: userResponse,
        token,
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteInternalUser = async (req: Request, res: Response) => {
  const internalUserId = req.params?.internalUserId;
  console.log('internalUserId', internalUserId)

  if (!internalUserId) {
    return res.status(400).json({ success: false, error: `internalUserId é obrigatório` });
  }

  try {
    const user = await InternalUserModel.findByPk(internalUserId);
    console.log('user', user)
    if (!user) {
      return res.status(403).json({ success: false, error: "Usuário não encontrado" });
    }
    console.log('req.internalUser?.id', req.internalUser?.id)
    await user.update({ isActive: false, deletedById: req.internalUser?.id, deletedAt: DateTime.now().toJSDate() });
    console.log('UPDATED')
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log('error', error)
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createInternalUser = async (req: Request<{}, {}, CreateInternalUserRequest>, res: Response) => {
  const { name, email, password, role } = req.body;
  const userId = req.internalUser?.id as number;
  try {
    const internalUserCreated = await InternalUserModel.create({
      name,
      email,
      password,
      role,
      isActive: true,
      createdById: userId,
      updatedById: userId,
    });
    const internalUserResponse = internalUserCreated.get();
    return res.status(201).json({
      success: true,
      message: 'Usuário interno criado com sucesso',
      data: {
        internalUser: internalUserResponse
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Não foi possível criar este usuário interno',
    });
  }
};

export const getInternalUsers = async (req: Request, res: Response) => {
  try {
    const response = await InternalUserModel.findAll({
      where: { isActive: true }
    });
    const internalUsers = [];
    for (let i = 0; i < response.length; i++) {
      const user = response[i];
      internalUsers.push(user.get());
    }
    return res.status(200).json({
      success: true,
      data: {
        internalUsers: internalUsers
      }
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar os usuários internos'
    });
  }
};
