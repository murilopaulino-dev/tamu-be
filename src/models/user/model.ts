import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { UserType as TypeOfUser, User } from '../../types/user';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';

type UserType = BaseModelType<User>;

class UserModel extends BaseModel<UserType, Optional<UserType, 'id'>>
  implements UserType {
  public id!: number;
  public name!: string;
  public email!: string;
  public type!: TypeOfUser;
  public companyId!: number;

  public checkPermission = async (companyId: number) => {
    return this.companyId === companyId;
  }
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
      type: DataTypes.ENUM(...Object.values(TypeOfUser)),
      allowNull: false,
      defaultValue: TypeOfUser.CUSTOMER,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    ...BASE_MODEL_INIT_COLUMNS,
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default UserModel;
