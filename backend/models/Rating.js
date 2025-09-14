const { createConnection } = require('../config/database');

class Rating {
  // Create new rating
  static async create(ratingData) {
    const connection = await createConnection();
    try {
      const { user_id, store_id, rating, comment } = ratingData;
      const [result] = await connection.execute(
        'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)',
        [user_id, store_id, rating, comment]
      );
      return result.insertId;
    } finally {
      await connection.end();
    }
  }

  // Find rating by user and store
  static async findByUserAndStore(userId, storeId) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
        [userId, storeId]
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  // Update rating
  static async update(id, ratingData) {
    const connection = await createConnection();
    try {
      const { rating, comment } = ratingData;
      await connection.execute(
        'UPDATE ratings SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?',
        [rating, comment, id]
      );
    } finally {
      await connection.end();
    }
  }

  // Find ratings by user ID
  static async findByUserId(userId) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT r.*, s.name as store_name, s.address as store_address
         FROM ratings r
         JOIN stores s ON r.store_id = s.id
         WHERE r.user_id = ?
         ORDER BY r.created_at DESC`,
        [userId]
      );
      return rows;
    } finally {
      await connection.end();
    }
  }

  // Find rating by ID
  static async findById(id) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM ratings WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }
}

module.exports = Rating;