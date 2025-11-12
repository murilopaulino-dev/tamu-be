import { DataTypes, Model, ModelStatic } from "sequelize";
import InternalUserModel from "./internalUser/model";

export abstract class BaseModel<TModelAttributes extends {} = any, TCreationAttributes extends {} = TModelAttributes>
  extends Model<TModelAttributes, TCreationAttributes> {
  public isActive!: boolean;
  public createdById!: number;
  public updatedById!: number;
  public deletedById?: number;

  public readonly createdBy!: InternalUserModel;
  public readonly updatedBy!: InternalUserModel;
  public readonly deletedBy?: InternalUserModel;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

export interface BaseModelStatic<M extends BaseModel> extends ModelStatic<M> { }

type ActiveModel = {
  isActive: boolean;
};

type DeletableModel = {
  createdById: number;
  updatedById: number;
  deletedById?: number;
  deletedAt?: Date;
};

export type BaseModelType<M> = ActiveModel & DeletableModel & M;

export const BASE_MODEL_INIT_COLUMNS = {
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
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  updatedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
};

export const createInternalUserModelAssociantion = <M extends BaseModel>(model: BaseModelStatic<M>) => {
  // USER - createdBy
  model.belongsTo(InternalUserModel, {
    foreignKey: 'createdById',
    as: 'createdBy',
  });

  // USER - updatedBy
  model.belongsTo(InternalUserModel, {
    foreignKey: 'updatedById',
    as: 'updatedBy',
  });

  // USER - deletedBy
  model.belongsTo(InternalUserModel, {
    foreignKey: 'deletedById',
    as: 'deletedBy',
  });
};
