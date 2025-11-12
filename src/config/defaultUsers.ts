import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from '../constants/config';
import InternalUserModel from '../models/internalUser/model';
import { InternalUserRole } from '../types/internalUser';

export const initializeDefaultUsers = async () => {
  try {
    if (!SUPER_ADMIN_EMAIL?.length || !SUPER_ADMIN_PASSWORD?.length) {
      throw new Error('No super admin Email or Password');
    }
    const existingSuperAdmin = await InternalUserModel.findOne({
      where: {
        email: SUPER_ADMIN_EMAIL
      }
    })

    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.name, existingSuperAdmin.email);
      throw new Error("Super admin already exists");
    }

    console.log('Creating super admin')
    const superAdmin = await InternalUserModel.create({
      name: 'SUPER_ADMIN',
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      role: InternalUserRole.SUPER_ADMIN,
      isActive: true,
    });

    console.log('Super admin created:', superAdmin.email);
  } catch (error: any) {
    if (!error?.message?.includes("already exists")) {
      console.error('Error initializing super admin:', error);
    }
  }
}