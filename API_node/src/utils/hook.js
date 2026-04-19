import User from "../models/user.js";

/**
 * Registers Global Hooks for the User model
 */
function setupUserHooks() {
  // Automatic phone formatting before saving to the database
  User.beforeSave(async (user) => {
    if (user.phone) {
      // Remove all non-numeric characters
      const number = user.phone.replace(/\D/g, '');

      // Apply formatting based on length (Brazilian standard)
      if (number.length === 10) {
        user.phone = `(${number.substring(0, 2)}) ${number.substring(2, 6)}-${number.substring(6, 10)}`;
      } else if (number.length === 11) {
        user.phone = `(${number.substring(0, 2)}) ${number.substring(2, 7)}-${number.substring(7, 11)}`;
      }
    }
  });
}

export { setupUserHooks };
