 import User from './user.js';
import Address from './address.js';

const setupAssociations = () => {

  
  User.hasMany(Address, {
    foreignKey: 'userId',
    as: 'addresses'
  });

  
  Address.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

export { setupAssociations };
