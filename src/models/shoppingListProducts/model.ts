import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { ShoppingListProducts } from '../../types/shoppingListProduct';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';
import ProductModel from '../product/model';
import ShoppingListModel from '../shoppingList/model';

type ShoppingListProductsType = BaseModelType<ShoppingListProducts>;

class ShoppingListProductsModel extends BaseModel<ShoppingListProductsType, Optional<ShoppingListProductsType, 'id'>>
  implements ShoppingListProductsType {
  public id!: number;
  public price!: number;
  public quantity!: number;
  public quantityPurchased!: number;
  public shoppingListId!: number;
  public productId!: number;

  public readonly product!: ProductModel;
  public readonly shoppingList!: ShoppingListModel;

  public async checkPermission(companyId: number) {
    return this.shoppingList.companyId === companyId;
  }
};

ShoppingListProductsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: new DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: new DataTypes.INTEGER,
      allowNull: false,
    },
    quantityPurchased: {
      type: new DataTypes.INTEGER,
    },
    shoppingListId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'shopping_lists',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    ...BASE_MODEL_INIT_COLUMNS
  },
  {
    sequelize,
    tableName: 'shopping_list_products',
  }
);

export default ShoppingListProductsModel;
