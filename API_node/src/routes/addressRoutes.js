import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress
} from '../controllers/addressController.js';

const router = Router();

/**
 * Address Management Routes
 * All routes are protected by the authenticateToken middleware
 */

// Create a new address
router.post('/addresses', authenticateToken, createAddress);

// List all addresses (typically for the logged user)
router.get('/addresses', authenticateToken, listAddresses);

// Update an address by ID
router.put('/addresses/:id', authenticateToken, updateAddress);

// Delete an address by ID
router.delete('/addresses/:id', authenticateToken, deleteAddress);

export default router;
