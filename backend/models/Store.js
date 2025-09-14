const { createConnection } = require('../config/database');

class Store {
  // Create new store
  static async create(storeData) {
    const connection = await createConnection();
    try {
      const { name, email, address, owner_id } = storeData;
      const [result] = await connection.execute(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [name, email, address, owner_id]
      );
      return result.insertId;
    } finally {
      await connection.end();
    }
  }

  // Find store by name
  static async findByName(name) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM stores WHERE name = ?',
        [name]
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  // Find store by ID
  static async findById(id) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT s.*, u.name as owner_name, u.email as owner_email,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as total_ratings
         FROM stores s
         LEFT JOIN users u ON s.owner_id = u.id
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.id = ?
         GROUP BY s.id`,
        [id]
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  // Find store by owner ID
  static async findByOwnerId(ownerId) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT s.*, COALESCE(AVG(r.rating), 0) as average_rating, 
                COUNT(r.id) as total_ratings
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY s.id`,
        [ownerId]
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  // Find all stores with filters and user ratings
  static async findAll(filters = {}, sortBy = 'name', sortOrder = 'asc', userId = null) {
    const connection = await createConnection();
    try {
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
      const params = [userId];

      // Apply filters
      if (filters.name) {
        query += ' AND s.name LIKE ?';
        params.push(`%${filters.name}%`);
      }
      if (filters.address) {
        query += ' AND s.address LIKE ?';
        params.push(`%${filters.address}%`);
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

      const [rows] = await connection.execute(query, params);
      return rows;
    } finally {
      await connection.end();
    }
  }

  // Get ratings for a store
  static async getRatings(storeId) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT r.*, u.name as user_name, u.email as user_email
         FROM ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.store_id = ?
         ORDER BY r.created_at DESC`,
        [storeId]
      );
      return rows;
    } finally {
      await connection.end();
    }
  }
}

module.exports = Store;