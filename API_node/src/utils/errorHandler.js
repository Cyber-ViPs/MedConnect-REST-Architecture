/**
 * Centralizes Sequelize-specific error handling
 */
function handleSequelizeError(err, res) {
  // Unique Constraint Errors (e.g., duplicated Email)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path;
    let errorMessage = 'Duplicate data found.';

    const customMessages = {
      'email': 'This email is already registered.',
      'phone': 'This phone number is already registered.',
    };

    errorMessage = customMessages[field] || errorMessage;
    return res.status(409).json({ error: errorMessage });
  }

  // Validation Errors (e.g., invalid email format)
  if (err.name === 'SequelizeValidationError') {
    const errorMessages = err.errors.map(error => {
      if (error.path === 'email' && error.validatorKey === 'isEmail') {
        return 'The provided email is not valid.';
      }
      return `The field '${error.path}' has an invalid value or is missing.`;
    });

    return res.status(400).json({ error: errorMessages[0] });
  }

  console.error('❌ Unexpected Error:', err);
  return res.status(500).json({ error: 'An internal server error occurred.' });
}

export { handleSequelizeError };
