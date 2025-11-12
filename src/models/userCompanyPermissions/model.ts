import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { SystemModules } from '../../types/system';
import { UserCompanyPermission } from '../../types/userCompanyPermission';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';

type UserCompanyPermissionsType = BaseModelType<UserCompanyPermission>;

class UserCompanyPermissions extends BaseModel<UserCompanyPermissionsType, UserCompanyPermissionsType>
  implements UserCompanyPermissionsType {
  public id!: number;
  public userId!: number;
  public companyId!: number;

  // Dynamic module fields - explicitly declare each SystemModule
  public shoppingList!: number;
  public generalInventory!: number;
  public nfe!: number;
  public supplier!: number;
  public finance!: number;

  // Method to get permission value for any module dynamically
  public getModulePermission(module: SystemModules): number {
    return (this as any)[module] || 0;
  }

  // Method to set permission value for any module dynamically
  public setModulePermission(module: SystemModules, value: number): void {
    (this as any)[module] = value;
  }

  // Method to get all module permissions as an object
  public getAllModulePermissions(): { [K in SystemModules]: number } {
    const permissions = {} as { [K in SystemModules]: number };
    Object.values(SystemModules).forEach(module => {
      permissions[module] = this.getModulePermission(module);
    });
    return permissions;
  }

  // Method to set multiple module permissions at once
  public setAllModulePermissions(permissions: Partial<{ [K in SystemModules]: number }>): void {
    Object.entries(permissions).forEach(([module, value]) => {
      if (Object.values(SystemModules).includes(module as SystemModules) && value !== undefined) {
        this.setModulePermission(module as SystemModules, value);
      }
    });
  }
}

// Generate dynamic field definitions from SystemModules enum
const generateModuleFields = () => {
  const moduleFields: Record<string, any> = {};

  Object.values(SystemModules).forEach((module) => {
    moduleFields[module] = {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    };
  });

  return moduleFields;
};

UserCompanyPermissions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'internal_users',
        key: 'id',
      },
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id',
      },
    },
    // Dynamically add all SystemModules as fields
    ...generateModuleFields(),
    ...BASE_MODEL_INIT_COLUMNS
  } as any, // Type assertion to bypass strict type checking for dynamic fields
  {
    sequelize,
    tableName: 'user_company_permissions',
  }
);

export default UserCompanyPermissions;
