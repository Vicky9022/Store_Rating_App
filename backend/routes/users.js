const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

  try {
    const db = req.app.locals.db;
    let query = `
      SELECT u.*, COALESCE(AVG(r.rating), 0) as average_rating 
      FROM users u 
      LEFT JOIN stores s ON u.id = s.owner_id 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE 1=1
    `;
    const params = [];

    // Apply filters
    if (name) {
      query += ' AND u.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND u.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND u.address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    query += ' GROUP BY u.id';
    
    // Apply sorting
    const validSortFields = ['name', 'email', 'address', 'role'];
    if (validSortFields.includes(sortBy)) {
      query += ` ORDER BY u.${sortBy} ${sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
    }

    const [users] = await db.promise().query(query, params);
    
    // Remove password from response
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    res.json(safeUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user (Admin only)
router.post('/', auth, adminAuth, [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be between 20-60 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,16})$/)
    .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character'),
  body('address').isLength({ max: 400 }).withMessage('Address must not exceed 400 characters'),
  body('role').isIn(['user', 'admin', 'store_owner']).withMessage('Invalid role')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, address, role } = req.body;

  try {
    const db = req.app.locals.db;
    
    // Check if user exists
    const [existingUsers] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const [users] = await db.promise().query(
      `SELECT u.*, COALESCE(AVG(r.rating), 0) as average_rating 
       FROM users u 
       LEFT JOIN stores s ON u.id = s.owner_id 
       LEFT JOIN ratings r ON s.id = r.store_id 
       WHERE u.id = ? 
       GROUP BY u.id`,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...safeUser } = users[0];
    res.json(safeUser);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats (Admin only)
router.get('/admin/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const [userCount] = await db.promise().query('SELECT COUNT(*) as total FROM users');
    const [storeCount] = await db.promise().query('SELECT COUNT(*) as total FROM stores');
    const [ratingCount] = await db.promise().query('SELECT COUNT(*) as total FROM ratings');

    res.json({
      totalUsers: userCount[0].total,
      totalStores: storeCount[0].total,
      totalRatings: ratingCount[0].total
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;