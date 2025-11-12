import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { ProductCategory } from '../../types/productCategory';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';

type ProductCategoryType = BaseModelType<ProductCategory>;

class ProductCategoryModel extends BaseModel<ProductCategoryType, Optional<ProductCategoryType, 'id'>>
  implements ProductCategoryType {
  public id!: number;
  public name!: string;
  public companyId!: number;

  public checkPermission = async (companyId: number) => {
    return this.companyId === companyId;
  }
};

ProductCategoryModel.init(
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
    tableName: 'product_categories',
  }
);

export default ProductCategoryModel;
