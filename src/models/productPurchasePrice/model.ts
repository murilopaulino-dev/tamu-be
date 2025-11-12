import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { ProductPurchasePrice } from '../../types/productPurchasePrice';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';
import ProductModel from '../product/model';

type ProductPurchasePriceType = BaseModelType<ProductPurchasePrice>;

class ProductPurchasePriceModel extends BaseModel<ProductPurchasePriceType, Optional<ProductPurchasePriceType, 'id'>>
  implements ProductPurchasePriceType {
  public id!: number;
  public name!: string;
  public price!: number;
  public date!: Date;
  public productId!: number;

  public readonly product!: ProductModel;

  public async checkPermission(companyId: number) {
    return this.product.companyId === companyId;
  }
};

ProductPurchasePriceModel.init(
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
    date: {
      type: new DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
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
    tableName: 'product_purchase_prices',
  }
);

export default ProductPurchasePriceModel;
