'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    
    const [existingAdmin] = await queryInterface.sequelize.query(
      `SELECT id from users WHERE email = 'teste.systems1@gmail.com' LIMIT 1;`
    );

    
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      return queryInterface.bulkInsert('users', [{
        name: 'Admin Sistema',
        email: 'teste.systems1@gmail.com',
        phone: '(11) 99999-9999',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }], {});
    }

    console.log('Seed: Admin user already exists. Skipping...');
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', { email: 'teste.systems1@gmail.com' }, {});
  }
};
