import { Request, Response } from "express";
import UserCompanyPermissions from "../models/userCompanyPermissions/model";
import { SystemModules } from "../types/system";

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
      // Dynamic permissions - each SystemModule as a field
      ...permissions, // This will spread all the module permissions dynamically
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

    // Use the helper method to get all module permissions
    const modulePermissions = permissions.getAllModulePermissions();

    return res.status(200).json({
      success: true,
      data: {
        userCompanyPermissions: permissions.get(),
        modulePermissions
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

    // Use the helper method to set multiple permissions at once
    userCompanyPermissions.setAllModulePermissions(permissions);
    userCompanyPermissions.updatedById = currentUserId;
    
    await userCompanyPermissions.save();

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

// Example: Check if user has permission for a specific module
export const checkModulePermission = async (req: Request, res: Response) => {
  try {
    const { userId, companyId, module } = req.params;

    if (!Object.values(SystemModules).includes(module as SystemModules)) {
      return res.status(400).json({
        success: false,
        message: 'Módulo inválido'
      });
    }

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
        hasPermission: false,
        message: 'Permissões não encontradas'
      });
    }

    const permissionLevel = permissions.getModulePermission(module as SystemModules);

    return res.status(200).json({
      success: true,
      hasPermission: permissionLevel > 0,
      permissionLevel,
      module
    });
  } catch (error) {
    console.error('Error checking module permission:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar permissão'
    });
  }
};