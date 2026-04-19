import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id', 
    references: { model: 'users', key: 'id' },
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Address',
  tableName: 'addresses',
  underscored: true, 
  timestamps: true,
});

export default Address;
