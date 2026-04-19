import Address from '../models/address.js';
import { findByIdOr404 } from '../utils/helpers.js';

/**
 * Register a new address
 */
async function createAddress(req, res, next) {
    const { street, number, city, zipCode, userId } = req.body;

  try {
    if (!street || !number || !city || !zipCode || !userId) {
      return res.status(400).json({
        error: 'Required fields: street, number, city, zipCode, userId.'
      });
    }

    const newAddress = await Address.create({
      street,
      number,
      city,
      zipCode,
      userId
    });

    res.status(201).json({
      message: 'Address registered successfully!',
      address: newAddress
    });
  } catch (err) {
    next(err);
  }
}

/**
 * List all addresses including owner information (Optional)
 */
async function listAddresses(req, res, next) {
  try {
    
    const addresses = await Address.findAll();
    res.json(addresses);
  } catch (err) {
    next(err);
  }
}


async function updateAddress(req, res, next) {
  const { id } = req.params;
  const { street, number, city, zipCode } = req.body;

  try {
    const address = await findByIdOr404(Address, id, res, 'Address');
    if (!address) return;

    if (street) address.street = street;
    if (number) address.number = number;
    if (city) address.city = city;
    if (zipCode) address.zipCode = zipCode;

    await address.save();
    res.json({ message: 'Address updated successfully!', address });
  } catch (err) {
    next(err);
  }
}

/**
 * Perform Soft Delete on an address
 */
async function deleteAddress(req, res, next) {
  const { id } = req.params;
  try {
    const address = await findByIdOr404(Address, id, res, 'Address');
    if (!address) return;

    await address.destroy();
    res.json({ message: 'Address deleted successfully (Soft Delete).' });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all addresses for a specific user
 */
async function getUserAddresses(req, res, next) {
  const { userId } = req.params;
  try {
    const addresses = await Address.findAll({
      where: { userId }
    });

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({ message: 'No addresses found for this user.' });
    }

    res.json(addresses);
  } catch (err) {
    next(err);
  }
}

export { createAddress, listAddresses, updateAddress, deleteAddress, getUserAddresses };
