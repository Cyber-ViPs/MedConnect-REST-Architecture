import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';
import {
  listUsers,
  createUser,
  login,
  requestPasswordReset,
  resetPassword,
  updateUser,
  deleteUser,
  restoreUser,
  getUserIncludingDeleted,
  getUser,
  listAllUsersAdmin
} from '../controllers/userController.js';
import { getUserAddresses } from '../controllers/addressController.js';

const router = Router();

/**
 * Helper Middleware: Permission check for update
 * Allows admins OR the user themselves to edit their data
 */
const checkUserPermission = (req, res, next) => {
  const { id } = req.params;
  const { id: loggedId, role } = req.user;

  if (role !== 'admin' && String(loggedId) !== String(id)) {
    return res.status(403).json({ error: 'Access denied: insufficient permissions.' });
  }
  next();
};

/**
 * Admin Management Routes
 */
router.get('/users/all', authenticateToken, authorizeRole('admin'), listAllUsersAdmin);
router.get('/users/all/:id', authenticateToken, authorizeRole('admin'), getUserIncludingDeleted);
router.put('/users/:id/restore', authenticateToken, authorizeRole('admin'), restoreUser);

/**
 * Public & Authentication Routes
 */
router.post('/users/login', login);
router.post('/users/create', createUser); // Or just router.post('/users', ...)
router.post('/users/password-reset', requestPasswordReset);
router.post('/users/password-reset/:token', resetPassword);

/**
 * Authenticated User Routes
 */
router.get('/users', authenticateToken, listUsers);
router.get('/users/:id', authenticateToken, getUser);
router.put('/users/:id', authenticateToken, checkUserPermission, updateUser);
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), deleteUser);

/**
 * Address Routes
 */
router.get('/users/:userId/addresses', getUserAddresses);

export default router;
