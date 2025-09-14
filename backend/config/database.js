const mysql = require('mysql2/promise');

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'store_rating_db',
      charset: 'utf8mb4'
    });
    
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

module.exports = { createConnection };