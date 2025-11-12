import { DataTypes, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { CompanyModules } from '../../types/companyModules';
import { BaseModel } from '../BaseModel';

interface CompanyModulesCreationAttributes extends Optional<CompanyModules, 'id'> { };

class CompanyModulesModel extends BaseModel<CompanyModules, CompanyModulesCreationAttributes>
  implements CompanyModules {
  public id!: number;
  public shoppingList!: number;
  public generalInventory!: number;
  public nfe!: number;
  public supplier!: number;
  public finance!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
};

CompanyModulesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shoppingList: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    generalInventory: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    nfe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    supplier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    finance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'company_modules',
  }
);

export default CompanyModulesModel;
