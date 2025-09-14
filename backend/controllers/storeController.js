const { validationResult } = require('express-validator');
const Store = require('../models/Store');

class StoreController {
  // Get all stores with filtering and sorting
  static async getStores(req, res) {
    try {
      const { name, address, sortBy = 'name', sortOrder = 'asc' } = req.query;
      const userId = req.user.id;
      
      const filters = { name, address };
      const stores = await Store.findAll(filters, sortBy, sortOrder, userId);

      res.json(stores);
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create new store (Admin only)
  static async createStore(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, address, owner_id } = req.body;

      // Verify owner exists and is a store_owner
      const User = require('../models/User');
      const owner = await User.findById(owner_id);
      if (!owner || owner.role !== 'store_owner') {
        return res.status(400).json({ message: 'Invalid store owner' });
      }

      // Check if store name already exists
      const existingStore = await Store.findByName(name);
      if (existingStore) {
        return res.status(400).json({ message: 'Store name already exists' });
      }

      // Create store
      const storeId = await Store.create({
        name,
        email,
        address,
        owner_id
      });

      res.status(201).json({ 
        message: 'Store created successfully',
        storeId 
      });
    } catch (error) {
      console.error('Create store error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get store for store owner
  static async getMyStore(req, res) {
    try {
      if (req.user.role !== 'store_owner') {
        return res.status(403).json({ message: 'Store owner access required' });
      }

      const store = await Store.findByOwnerId(req.user.id);
      res.json(store);
    } catch (error) {
      console.error('Get my store error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get store ratings
  static async getStoreRatings(req, res) {
    try {
      const storeId = req.params.id;

      // Verify store ownership or admin access
      if (req.user.role !== 'admin') {
        const store = await Store.findById(storeId);
        if (!store || store.owner_id !== req.user.id) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      const ratings = await Store.getRatings(storeId);
      res.json(ratings);
    } catch (error) {
      console.error('Get store ratings error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = StoreController;