import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { GeneralInventoryProduct } from '../../types/generalInventoryProduct';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';
import GeneralInventoryModel from '../generalInventory/model';
import ProductModel from '../product/model';

type GeneralInventoryProductType = BaseModelType<GeneralInventoryProduct>;

class GeneralInventoryProductModel extends BaseModel<GeneralInventoryProductType, Optional<GeneralInventoryProductType, 'id'>>
  implements GeneralInventoryProductType {
  public id!: number;
  public quantity!: number;
  public minQuantityAlert?: number;
  public productId!: number;
  public generalInventoryId!: number;

  public readonly product!: ProductModel;
  public readonly generalInventory!: GeneralInventoryModel;

  public async checkPermission(companyId: number) {
    return this.product.companyId === companyId;
  }
};

GeneralInventoryProductModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: new DataTypes.INTEGER,
      allowNull: false,
    },
    minQuantityAlert: {
      type: new DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    generalInventoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'generalInventories',
        key: 'id',
      },
    },
    ...BASE_MODEL_INIT_COLUMNS
  },
  {
    sequelize,
    tableName: 'generalInventoryProducts',
  }
);

export default GeneralInventoryProductModel;
