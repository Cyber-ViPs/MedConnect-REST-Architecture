import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifies if the JWT token is valid
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session.' });
    }
    req.user = user;
    next();
  });
}

/**
 * Authorizes access based on user role
 */
export function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Unidentified permission.' });
    }

    const userRole = req.user.role;

    // Admin has unrestricted access
    if (userRole === 'admin') {
      return next();
    }

    // Check if the user role is in the allowed list
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (rolesArray.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied: your account does not have permission for this action.' });
  };
}