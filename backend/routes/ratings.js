const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Submit or update rating
router.post('/', auth, [
  body('store_id').isInt().withMessage('Valid store ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string')
], async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only normal users can submit ratings' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { store_id, rating, comment } = req.body;

  try {
    const db = req.app.locals.db;
    
    // Check if store exists
    const [stores] = await db.promise().query(
      'SELECT * FROM stores WHERE id = ?',
      [store_id]
    );

    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const [existingRatings] = await db.promise().query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [req.user.id, store_id]
    );

    if (existingRatings.length > 0) {
      // Update existing rating
      await db.promise().query(
        'UPDATE ratings SET rating = ?, comment = ?, updated_at = NOW() WHERE user_id = ? AND store_id = ?',
        [rating, comment || null, req.user.id, store_id]
      );
      res.json({ 
        message: 'Rating updated successfully',
        ratingId: existingRatings[0].id
      });
      
    } else {
      // Create new rating
      const [result] = await db.promise().query(
        'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)',
        [req.user.id, store_id, rating, comment || null]
      );
      res.status(201).json({ 
        message: 'Rating submitted successfully',
        ratingId: result.insertId
      });
    }
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's ratings
router.get('/my-ratings', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const [ratings] = await db.promise().query(
      `SELECT r.*, s.name as store_name, s.address as store_address
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    res.json(ratings);
  } catch (error) {
    console.error('Get my ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  // Update rating by ID
router.put('/:id', auth, async (req, res) => {
  const ratingId = req.params.id;
  const { rating, comment } = req.body;

  try {
    const db = req.app.locals.db;

    // Check if the rating exists and belongs to the logged-in user
    const [existingRatings] = await db.promise().query(
      'SELECT * FROM ratings WHERE id = ? AND user_id = ?',
      [ratingId, req.user.id]
    );

    if (existingRatings.length === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Update the rating
    await db.promise().query(
      'UPDATE ratings SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?',
      [rating, comment || null, ratingId]
    );

    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// **New route: Get all ratings for a specific store (for store owners)**
router.get('/store/:storeId', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const storeId = req.params.storeId;

    const [ratings] = await db.promise().query(
      `SELECT r.*, u.name as user_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    res.json(ratings);
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
