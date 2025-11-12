import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { ShoppingList, ShoppingListStatus } from '../../types/shoppingList';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';

type ShoppingListType = BaseModelType<ShoppingList>;

class ShoppingListModel extends BaseModel<ShoppingListType, Optional<ShoppingListType, 'id'>>
  implements ShoppingListType {
  public id!: number;
  public name!: string;
  public status!: ShoppingListStatus;
  public companyId!: number;

  public async checkPermission(companyId: number) {
    return this.companyId === companyId;
  }
};

ShoppingListModel.init(
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
    status: {
      type: DataTypes.ENUM(...Object.values(ShoppingListStatus)),
      defaultValue: ShoppingListStatus.CREATED
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id',
      },
    },
    ...BASE_MODEL_INIT_COLUMNS
  },
  {
    sequelize,
    tableName: 'shopping_lists',
  }
);

export default ShoppingListModel;
