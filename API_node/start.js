import 'dotenv/config';
import sequelize from './src/config/database.js';
import { setupAssociations } from './src/models/associations.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

/**
 * Initialize model associations
 */
setupAssociations();

/**
 * Initializes the server and verifies the Database connection
 */
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    // Note: Automatic synchronization disabled in favor of Migrations
    // await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Critical error while starting the server:', error);
    process.exit(1);
  }
}

startServer();
