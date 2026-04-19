// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Invalid email format." }, 
      notEmpty: { msg: "Email cannot be empty." }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
    
    is: {
      args: [/^[0-9()-\s]+$/i],
      msg: "Phone contains invalid characters (letters are not allowed)."}
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'manager', 'editor'),
    defaultValue: 'user',
    allowNull: false,
  },
  // Soft Delete Column
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Password Reset Columns
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  modelName: 'User',
  paranoid: true, // Enables Soft Delete
  timestamps: true,
  tableName: 'users', // Name of the table in the database
  underscored: true, // Optional: recommended for PostgreSQL (uses created_at instead of createdAt)
});

// Hook for phone formatting before saving
User.beforeSave(async (user) => {
  if (user.phone) {
    let cleanNumber = user.phone.replace(/\D/g, '');

    if (cleanNumber.length !== 10 && cleanNumber.length !== 11) {
      throw new Error('Phone must contain 10 or 11 numeric digits.');
    }

    if (cleanNumber.length === 10) {
      user.phone = `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 6)}-${cleanNumber.substring(6, 10)}`;
    } else if (cleanNumber.length === 11) {
      user.phone = `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 7)}-${cleanNumber.substring(7, 11)}`;
    }
  }
});

export default User;
