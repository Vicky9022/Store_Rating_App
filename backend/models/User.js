const { createConnection } = require('../config/database');

class User {
  // Create new user
  static async create(userData) {
    const connection = await createConnection();
    try {
      const { name, email, password, address, role } = userData;
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, password, address, role]
      );
      return result.insertId;
    } finally {
      await connection.end();
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  // Find user by ID
  static async findById(id) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT u.*, COALESCE(AVG(r.rating), 0) as average_rating 
         FROM users u 
         LEFT JOIN stores s ON u.id = s.owner_id 
         LEFT JOIN ratings r ON s.id = r.store_id 
         WHERE u.id = ? 
         GROUP BY u.id`,
        [id]
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  // Find all users with filters
  static async findAll(filters = {}, sortBy = 'name', sortOrder = 'asc') {
    const connection = await createConnection();
    try {
      let query = `
        SELECT u.*, COALESCE(AVG(r.rating), 0) as average_rating 
        FROM users u 
        LEFT JOIN stores s ON u.id = s.owner_id 
        LEFT JOIN ratings r ON s.id = r.store_id 
        WHERE 1=1
      `;
      const params = [];

      // Apply filters
      if (filters.name) {
        query += ' AND u.name LIKE ?';
        params.push(`%${filters.name}%`);
      }
      if (filters.email) {
        query += ' AND u.email LIKE ?';
        params.push(`%${filters.email}%`);
      }
      if (filters.address) {
        query += ' AND u.address LIKE ?';
        params.push(`%${filters.address}%`);
      }
      if (filters.role) {
        query += ' AND u.role = ?';
        params.push(filters.role);
      }

      query += ' GROUP BY u.id';
      
      // Apply sorting
      const validSortFields = ['name', 'email', 'address', 'role', 'created_at'];
      if (validSortFields.includes(sortBy)) {
        query += ` ORDER BY u.${sortBy} ${sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
      }

      const [rows] = await connection.execute(query, params);
      return rows;
    } finally {
      await connection.end();
    }
  }

  // Update password
  static async updatePassword(id, hashedPassword) {
    const connection = await createConnection();
    try {
      await connection.execute(
        'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
        [hashedPassword, id]
      );
    } finally {
      await connection.end();
    }
  }

  // Get dashboard statistics
  static async getDashboardStats() {
    const connection = await createConnection();
    try {
      const [userCount] = await connection.execute('SELECT COUNT(*) as total FROM users');
      const [storeCount] = await connection.execute('SELECT COUNT(*) as total FROM stores');
      const [ratingCount] = await connection.execute('SELECT COUNT(*) as total FROM ratings');
      const [avgRating] = await connection.execute('SELECT COALESCE(AVG(rating), 0) as average FROM ratings');

      return {
        totalUsers: userCount[0].total,
        totalStores: storeCount[0].total,
        totalRatings: ratingCount[0].total,
        averageRating: avgRating[0].average
      };
    } finally {
      await connection.end();
    }
  }
}

module.exports = User;