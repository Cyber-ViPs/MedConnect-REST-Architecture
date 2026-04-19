// config/config.cjs
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'banco_post',
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    }
  }
};
