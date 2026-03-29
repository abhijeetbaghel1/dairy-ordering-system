const { pool } = require('../config/database');

class Product {
  // Get all products
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY name');
      return rows;
    } catch (error) {
      throw new Error('Error fetching products: ' + error.message);
    }
  }

  // Create new product
  static async create(productData) {
    try {
      const { name, price, unit } = productData;
      const [result] = await pool.query(
        'INSERT INTO products (name, price, unit) VALUES (?, ?, ?)',
        [name, price, unit]
      );
      return { id: result.insertId, name, price, unit };
    } catch (error) {
      throw new Error('Error creating product: ' + error.message);
    }
  }

  // Get product by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching product: ' + error.message);
    }
  }

  // Update product
  static async update(id, productData) {
    try {
      const { name, price, unit } = productData;
      await pool.query(
        'UPDATE products SET name = ?, price = ?, unit = ? WHERE id = ?',
        [name, price, unit, id]
      );
      return { id, name, price, unit };
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  }

  // Delete product
  static async delete(id) {
    try {
      await pool.query('DELETE FROM products WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw new Error('Error deleting product: ' + error.message);
    }
  }
}

module.exports = Product;
