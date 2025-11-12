import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { Product, ProductUnitType } from '../../types/product';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';
import ProductCategoryModel from '../productCategory/model';

type ProductType = BaseModelType<Product>;

class ProductModel extends BaseModel<ProductType, Optional<ProductType, 'id'>>
  implements ProductType {
  public id!: number;
  public name!: string;
  public code!: string;
  public barCode?: string;
  public basePrice!: number;
  public unitType!: ProductUnitType;
  public categoryId?: number;
  public companyId!: number;

  public readonly category?: ProductCategoryModel;

  public async checkPermission(companyId: number) {
    return this.companyId === companyId;
  }
};

ProductModel.init(
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
    code: {
      type: new DataTypes.STRING(128),
    },
    barCode: {
      type: new DataTypes.STRING(128),
      unique: true,
    },
    basePrice: {
      type: new DataTypes.FLOAT,
      allowNull: false,
    },
    unitType: {
      type: DataTypes.ENUM(...Object.values(ProductUnitType)),
      defaultValue: ProductUnitType.UNIT
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product_categories',
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
    ...BASE_MODEL_INIT_COLUMNS,
  },
  {
    sequelize,
    tableName: 'products',
  }
);

export default ProductModel;
