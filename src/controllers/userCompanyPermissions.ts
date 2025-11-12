import { Request, Response } from "express";
import UserCompanyPermissions from "../models/userCompanyPermissions/model";

export const createUserCompanyPermissions = async (req: Request, res: Response) => {
  const { userId, companyId, permissions } = req.body;
  const currentUserId = req.internalUser?.id as number;

  try {
    const userCompanyPermissions = await UserCompanyPermissions.create({
      userId,
      companyId,
      isActive: true,
      createdById: currentUserId,
      updatedById: currentUserId,
      ...permissions,
    });

    return res.status(201).json({
      success: true,
      message: 'Permissões criadas com sucesso',
      data: {
        userCompanyPermissions: userCompanyPermissions.get()
      }
    });
  } catch (error) {
    console.error('Error creating user company permissions:', error);
    return res.status(400).json({
      success: false,
      message: 'Não foi possível criar as permissões',
    });
  }
};

export const getUserCompanyPermissions = async (req: Request, res: Response) => {
  try {
    const { userId, companyId } = req.params;

    const permissions = await UserCompanyPermissions.findOne({
      where: {
        userId,
        companyId,
        isActive: true
      }
    });

    if (!permissions) {
      return res.status(404).json({
        success: false,
        message: 'Permissões não encontradas'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        userCompanyPermissions: permissions.get(),
      }
    });
  } catch (error) {
    console.error('Error getting user company permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar permissões'
    });
  }
};

export const updateUserCompanyPermissions = async (req: Request, res: Response) => {
  try {
    const { permissionId } = req.params;
    const { permissions } = req.body;
    const currentUserId = req.internalUser?.id as number;

    const userCompanyPermissions = await UserCompanyPermissions.findByPk(permissionId);

    if (!userCompanyPermissions) {
      return res.status(404).json({
        success: false,
        message: 'Permissões não encontradas'
      });
    }

    // -- create update functionality

    return res.status(200).json({
      success: true,
      message: 'Permissões atualizadas com sucesso',
      data: {
        userCompanyPermissions: userCompanyPermissions.get()
      }
    });
  } catch (error) {
    console.error('Error updating user company permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar permissões'
    });
  }
};
