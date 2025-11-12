import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/auth';
import { BaseModel, BaseModelStatic } from '../models/BaseModel';
import CompanyModel from '../models/company/model';
import CompanyModulesModel from '../models/companyModules/model';
import InternalUserModel from '../models/internalUser/model';
import UserCompanyPermissions from '../models/userCompanyPermissions/model';
import { InternalUser, InternalUserRole } from '../types/internalUser';
import { SystemModules } from '../types/system';

declare global {
  namespace Express {
    interface Request {
      internalUser?: InternalUserModel;
      company?: CompanyModel;
      [key: string]: { id: number };
    }
  }
}

const permissionDenied = (res: Response, error: string, message = "Permissão negada",) => {
  return res.status(401).json({
    success: false,
    message,
    error
  });
};

export const authenticateSelfOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.internalUser && req.internalUser.isActive && req.internalUser.id.toString() === req.params.userId) {
      return next();
    }
    return res.status(500).json({
      success: false,
      error: 'Permissão negada',
      from: "Negado"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Permissão negada',
      from: err
    });
  }
};

export const authenticateUser = (allowedSystemRoles?: InternalUserRole[]) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hasSystemRoles = !!allowedSystemRoles?.length;
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const companyId = req.header('Company-ID');

    if (!token) {
      return permissionDenied(res, 'No token');
    }
    const decoded = jwt.verify(token, JWT_SECRET) as Pick<InternalUser, 'id'>;
    const user = await InternalUserModel.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return permissionDenied(res, 'No user or user not active');
    }

    if (hasSystemRoles && !allowedSystemRoles.includes(user.role)) {
      return permissionDenied(res, 'Failed system role');
    }

    if (companyId) {
      const company = await CompanyModel.findByPk(companyId);
      if (!company || !company.isActive) {
        return permissionDenied(res, 'No company or company not active');
      }
      req.company = company;
    }

    req.internalUser = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Permissão negada',
      from: "catch",
      details: JSON.stringify(err),
    });
  }
};

export const authenticateCompany = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.company) {
    return permissionDenied(res, 'Empresa não encontrada');
  }
  next();
}

export const checkUserModulePermission = (module?: SystemModules) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.company || !req.internalUser) {
    return permissionDenied(res, 'Empresa ou usuário não encontrado');
  }
  const permission = await UserCompanyPermissions.findOne({
    where: {
      userId: req.internalUser?.id,
      companyId: req.company?.id,
      isActive: true,
      [module as string]: true
    }
  });
  if (!permission) {
    return permissionDenied(res, 'Permissão negada para este módulo');
  }
  next();
}

export const checkCompanyOwnership = <M extends BaseModel>(model: BaseModelStatic<M>, paramId: string, itemKeyToAddOnRequest = "item") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params[paramId] || req.body[paramId];
    const companyId = req.company?.id;

    if (!itemId) {
      return res.status(400).json({ success: false, error: `${paramId} é obrigatório` });
    }

    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Empresa não encontrada' });
    }

    try {
      const item = await model.findByPk(itemId);

      if (!item?.isActive) {
        return res.status(404).json({
          success: false,
          error: `Permissão negada`,
          from: 'item not active'
        });
      }

      const hasPermission = !!(await item?.checkPermission(companyId));
      if (!hasPermission) {
        return res.status(404).json({
          success: false,
          error: `Permissão negada`,
          from: '!hasPermission'
        });
      }
      req[itemKeyToAddOnRequest] = item as any;
      next();
    } catch (error) {
      console.log('error', error)
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  };
};

export const checkCompanyModulesPermission = (module: SystemModules) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.company?.id;

    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Empresa não encontrada' });
    }

    try {
      const companiesPermission = await CompanyModulesModel.findAll();
      const companyPermission = companiesPermission?.[0];
      const modulePermission = companyPermission?.[module];

      if (!modulePermission) {
        return res.status(404).json({
          success: false,
          error: `Permissão negada`,
        });
      }

      next();
    } catch (error) {
      console.log('error', error)
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  };
};
