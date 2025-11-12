import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { User, UserType } from '../../types/user';
import { BaseModelType } from '../BaseModel';
import InternalUserModel from '../internalUser/model';

type UserModelType = Optional<BaseModelType<User>, 'createdById' | 'updatedById'>;

class UserModel extends Model<UserModelType, Optional<UserModelType, 'id'>>
  implements UserModelType {
  public id!: number;
  public name!: string;
  public email!: string;
  public type!: UserType;

  public isActive!: boolean;
  public createdById?: number;
  public updatedById?: number;
  public deletedById?: number;

  public readonly createdBy?: InternalUserModel;
  public readonly updatedBy?: InternalUserModel;
  public readonly deletedBy?: InternalUserModel;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
};

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    type: {
      type: DataTypes.ENUM(...Object.values(UserType)),
      allowNull: false,
      defaultValue: UserType.CUSTOMER,
    },
    isActive: {
      type: new DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    deletedAt: {
      type: new DataTypes.DATE,
    },
    deletedById: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdById: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    updatedById: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default UserModel;
