const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all stores
router.get('/', auth, async (req, res) => {
  const { name, address, sortBy = 'name', sortOrder = 'asc' } = req.query;

  try {
    const db = req.app.locals.db;
    let query = `
      SELECT s.*, u.name as owner_name, u.email as owner_email, u.address as owner_address,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings,
             ur.rating as user_rating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [req.user.id];

    // Apply filters
    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id';
    
    // Apply sorting
    const validSortFields = ['name', 'address', 'average_rating'];
    if (validSortFields.includes(sortBy)) {
      if (sortBy === 'average_rating') {
        query += ` ORDER BY average_rating ${sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
      } else {
        query += ` ORDER BY s.${sortBy} ${sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
      }
    }

    const [stores] = await db.promise().query(query, params);
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create store (Admin only)
router.post('/', auth, adminAuth, [
  body('name').isLength({ min: 1, max: 100 }).withMessage('Store name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('address').isLength({ max: 400 }).withMessage('Address must not exceed 400 characters'),
  body('owner_id').isInt().withMessage('Valid owner ID is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, address, owner_id } = req.body;

  try {
    const db = req.app.locals.db;
    
    // Verify owner exists and is a store_owner
    const [owners] = await db.promise().query(
      'SELECT * FROM users WHERE id = ? AND role = ?', 
      [owner_id, 'store_owner']
    );

    if (owners.length === 0) {
      return res.status(400).json({ message: 'Invalid store owner' });
    }

    // Check if store name already exists
    const [existingStores] = await db.promise().query(
      'SELECT * FROM stores WHERE name = ?', 
      [name]
    );

    if (existingStores.length > 0) {
      return res.status(400).json({ message: 'Store name already exists' });
    }

    // Create store
    const [result] = await db.promise().query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );

    res.status(201).json({ 
      message: 'Store created successfully',
      storeId: result.insertId 
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stores for store owner
router.get('/my-store', auth, async (req, res) => {
  if (req.user.role !== 'store_owner') {
    return res.status(403).json({ message: 'Store owner access required' });
  }

  try {
    const db = req.app.locals.db;
    
    const [stores] = await db.promise().query(
      `SELECT s.*, COALESCE(AVG(r.rating), 0) as average_rating, COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [req.user.id]
    );

    res.json(stores || null);
  } catch (error) {
    console.error('Get my store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get store ratings (Store owner only)
router.get('/:id/ratings', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Verify store ownership or admin access
    if (req.user.role !== 'admin') {
      const [stores] = await db.promise().query(
        'SELECT * FROM stores WHERE id = ? AND owner_id = ?',
        [req.params.id, req.user.id]
      );

      if (stores.length === 0) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const [ratings] = await db.promise().query(
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    res.json(ratings);
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;