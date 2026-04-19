import { handleSequelizeError } from '../utils/errorHandler.js';

/**
 * Global middleware for error catching and handling
 */
function errorHandlerMiddleware(err, req, res, next) {
  // Attempt to handle specific Sequelize ORM errors
  const handledResponse = handleSequelizeError(err, res);
  
  // If the utility function already handled the error and sent a response, stop here
  if (handledResponse) return;

  // Detailed log for the developer in the terminal
  console.error(' [Internal Server Error]:', err.stack || err);

  // Generic and secure response for the client
  res.status(500).json({ 
    error: 'An unexpected internal error occurred on the server. Please try again later.' 
  });
}

export { errorHandlerMiddleware };