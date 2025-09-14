const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

class UserController {
  // Get all users with filtering and sorting
  static async getUsers(req, res) {
    try {
      const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;
      
      const filters = { name, email, address, role };
      const users = await User.findAll(filters, sortBy, sortOrder);

      // Remove passwords from response
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });

      res.json(safeUsers);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create new user (Admin only)
  static async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, address, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const userId = await User.create({
        name,
        email,
        password: hashedPassword,
        address,
        role
      });

      res.status(201).json({ 
        message: 'User created successfully',
        userId 
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get dashboard statistics
  static async getDashboardStats(req, res) {
    try {
      const stats = await User.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = UserController;