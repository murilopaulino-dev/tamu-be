import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/auth';
import CompanyModel from '../models/company/model';
import CompanyModulesModel from '../models/companyModules/model';
import InternalUserModel from '../models/internalUser/model';
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
