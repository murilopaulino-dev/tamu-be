import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { Company } from '../../types/company';
import { BASE_MODEL_INIT_COLUMNS, BaseModel, BaseModelType } from '../BaseModel';

type CompanyModelType = BaseModelType<Company>;

class CompanyModel extends BaseModel<CompanyModelType, Optional<CompanyModelType, 'id'>>
  implements CompanyModelType {
  public id!: number;
  public name!: string;
  public email!: string;
  public cnpj!: string;

  public async checkPermission(companyId: number) {
    return this.id === companyId;
  }
};

CompanyModel.init(
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
    },
    cnpj: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    ...BASE_MODEL_INIT_COLUMNS
  },
  {
    sequelize,
    tableName: 'company',
  }
);

export default CompanyModel;
