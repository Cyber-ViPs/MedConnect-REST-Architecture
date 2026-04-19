import { Op } from 'sequelize';
import User from '../models/user.js';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findByIdOr404 } from '../utils/helpers.js';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';
import Address from '../models/address.js';
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_SERVICE_USER = process.env.EMAIL_SERVICE_USER;
const EMAIL_SERVICE_PASS = process.env.EMAIL_SERVICE_PASS;
const FRONTEND_URL = process.env.FRONTEND_URL;

// List all active users
async function listUsers(req, res, next) {
  const { include, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;

    const queryOptions = {
      attributes: { exclude: ['password'] },
      limit: parseInt(limit), 
      offset: parseInt(offset), 
      order: [['createdAt', 'DESC']]
    };

    if (include === 'addresses') {
      queryOptions.include = [{ model: Address, as: 'addresses' }];
    }

   
    const { count, rows } = await User.findAndCountAll(queryOptions);

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: rows
    });
  } catch (err) {
    next(err);
  }
}

// Create new user
async function createUser(req, res, next) {
  const { name, email, phone, password, role, address } = req.body;

  try {
    // 1. Initial Validations
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required.' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }

    // Admin limit check
    if (role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount >= 1) {
        return res.status(400).json({ error: 'Admin limit exceeded.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Atomic Transaction
    const newUser = await sequelize.transaction(async (t) => {
      // Create the User
      const createdUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || 'user',
      }, { transaction: t });

      // If address data is present, create it linked to the new user ID
      if (address) {
        await Address.create({
          ...address,
          userId: createdUser.id
        }, { transaction: t });
      }

      return createdUser;
    });

    // 3. Fetch the complete user with addresses to return
    const fullUser = await User.findByPk(newUser.id, {
      include: [{ model: Address, as: 'addresses' }],
      attributes: { exclude: ['password'] }
    });

    return res.status(201).json({
      message: 'User and Address created successfully!',
      user: fullUser
    });

  } catch (err) {
    // Passes the error to the handleSequelizeError middleware
    next(err);
  }
}

// Update existing user
async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, phone, password, role } = req.body;

  try {
    const user = await findByIdOr404(User, id, res, 'User');
    if (!user) return;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ error: 'This email is already in use.' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'User updated successfully!', user });
  } catch (err) {
    throw err;
  }
}

// Login
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Delete user (Soft Delete)
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const user = await findByIdOr404(User, id, res, 'User');
    if (!user) return;

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    throw err;
  }
}

// Restore soft-deleted user
async function restoreUser(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await user.restore();
    res.status(200).json({ message: 'User restored successfully!', user });
  } catch (err) {
    throw err;
  }
}

// Find one specific user (including deleted)
async function getUserIncludingDeleted(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    throw err;
  }
}

// Request password reset link
async function requestPasswordReset(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: 'If the email is registered, a reset link will be sent.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_SERVICE_USER,
        pass: EMAIL_SERVICE_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: EMAIL_SERVICE_USER,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${FRONTEND_URL}/reset-password/${token}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'If the email is registered, a reset link will be sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset request.' });
  }
}

// Reset password with token
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match or are invalid.' });
  }

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password.' });
  }
}

async function getUser(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
     
      include: [{
        model: Address,
        as: 'addresses' 
      }],
      
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}


async function listAllUsersAdmin(req, res, next) {
  const { include } = req.query; 

  try {
    const queryOptions = {
      paranoid: false,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    };

    
    if (include === 'addresses') {
      queryOptions.include = [{ model: Address, as: 'addresses' }];
    }

    const users = await User.findAll(queryOptions);
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export {
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
  listAllUsersAdmin,
};
