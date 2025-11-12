import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { GeneralInventory } from '../../types/generalInventory';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';

type GeneralInventoryType = BaseModelType<GeneralInventory>;

class GeneralInventoryModel extends BaseModel<GeneralInventoryType, Optional<GeneralInventoryType, 'id'>>
  implements GeneralInventoryType {
  public id!: number;
  public name!: string;
};

GeneralInventoryModel.init(
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
    ...BASE_MODEL_INIT_COLUMNS
  },
  {
    sequelize,
    tableName: 'generalInventories',
  }
);

export default GeneralInventoryModel;
