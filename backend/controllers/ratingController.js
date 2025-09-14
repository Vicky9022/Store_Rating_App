const { validationResult } = require('express-validator');
const Rating = require('../models/Rating');

class RatingController {
  // Submit or update rating
  static async submitRating(req, res) {
    try {
      if (req.user.role !== 'user') {
        return res.status(403).json({ message: 'Only normal users can submit ratings' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { store_id, rating } = req.body;
      const userId = req.user.id;

      // Check if store exists
      const Store = require('../models/Store');
      const store = await Store.findById(store_id);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      // Check if user already rated this store
      const existingRating = await Rating.findByUserAndStore(userId, store_id);

      if (existingRating) {
        // Update existing rating
        await Rating.update(existingRating.id, { rating, Comment });
        res.json({ message: 'Rating updated successfully' });
      } else {
        // Create new rating
        const ratingId = await Rating.create({
          user_id: userId,
          store_id,
          rating,
          Comment
        });
        res.status(201).json({ 
          message: 'Rating submitted successfully',
          ratingId 
        });
      }
    } catch (error) {
      console.error('Submit rating error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get user's ratings
  static async getMyRatings(req, res) {
    try {
      const ratings = await Rating.findByUserId(req.user.id);
      res.json(ratings);
    } catch (error) {
      console.error('Get my ratings error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = RatingController;