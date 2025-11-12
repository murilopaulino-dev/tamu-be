import bcrypt from 'bcryptjs';
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { InternalUser, InternalUserRole } from '../../types/internalUser';
import { BaseModelType } from '../BaseModel';

type UserModelType = Optional<BaseModelType<InternalUser>, 'createdById' | 'updatedById'>;

class InternalUserModel extends Model<UserModelType, Optional<UserModelType, 'id'>>
  implements UserModelType {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: InternalUserRole;

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

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
};

InternalUserModel.init(
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },
    role: {
      type: DataTypes.ENUM(...Object.values(InternalUserRole)),
      allowNull: false,
      defaultValue: InternalUserRole.SALESMAN,
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
    tableName: 'internal_users',
    hooks: {
      beforeCreate: async (user: InternalUserModel) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: InternalUserModel) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default InternalUserModel;
