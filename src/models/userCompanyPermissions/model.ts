import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { UserCompanyPermission } from '../../types/userCompanyPermission';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';

type UserCompanyPermissionsType = BaseModelType<UserCompanyPermission>;

class UserCompanyPermissions extends BaseModel<UserCompanyPermissionsType, UserCompanyPermissionsType>
  implements UserCompanyPermissionsType {
  public id!: number;
  public userId!: number;
  public companyId!: number;

  public shoppingList!: boolean;
  public generalInventory!: boolean;
  public nfe!: boolean;
  public supplier!: boolean;
  public finance!: boolean;
}

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
    shoppingList: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    generalInventory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    nfe: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    supplier: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    finance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ...BASE_MODEL_INIT_COLUMNS
  },
  {
    sequelize,
    tableName: 'user_company_permissions',
  }
);

export default UserCompanyPermissions;
