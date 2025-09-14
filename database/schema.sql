CREATE DATABASE IF NOT EXISTS store_rating_db;
USE store_rating_db;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ratings table
CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store (user_id, store_id)
);

-- Insert default admin user
INSERT INTO users (name, email, password, role) VALUES 
('System Administrator Account', 'admin@storerating.com', '$2a$10$rOzJKjlEeYvV4ZoOFgx8w.vQd8kHmZYEfS2QKd3oL8M1rNp0QdZe.', 'admin');

-- Insert sample store owners
INSERT INTO users (name, email, password, address, role) VALUES 
('Sample Store Owner One Account', 'owner1@example.com', '$2a$10$rOzJKjlEeYvV4ZoOFgx8w.vQd8kHmZYEfS2QKd3oL8M1rNp0QdZe.', '123 Main St, City, State', 'store_owner'),
('Another Sample Store Owner Account', 'owner2@example.com', '$2a$10$rOzJKjlEeYvV4ZoOFgx8w.vQd8kHmZYEfS2QKd3oL8M1rNp0QdZe.', '456 Oak Ave, City, State', 'store_owner');

-- Insert sample stores
INSERT INTO stores (name, email, address, owner_id) VALUES 
('Tech Electronics Store', 'contact@techelectronics.com', '123 Main St, Tech City, TC 12345', 2),
('Fashion Hub Boutique', 'info@fashionhub.com', '456 Oak Ave, Fashion District, FD 67890', 3);

-- Note: Default password for all sample accounts is 


--admin
--admin@storerating.com
-- 'Password123!' 

--Store Owner
--owner1@example.com
--'Storeowner123!'