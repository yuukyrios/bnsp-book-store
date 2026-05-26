const db = require('../config/db');
const { success, error } = require('../utils/response');
const fs = require('fs');
const path = require('path');

const imgUrl = (req, filename) =>
  filename ? `${req.protocol}://${req.get('host')}/uploads/product-images/${filename}` : null;

// ─── Create product ───────────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const { store_id, genre_id, book_type_id, name, description, price, quantity } = req.body;

    if (!store_id || !name || !price || quantity === undefined)
      return error(res, 'store_id, name, price and quantity are required', 400);

    // Ensure store belongs to the merchant
    const [store] = await db.query(
      'SELECT id FROM stores WHERE id = ? AND merchant_id = ?',
      [store_id, req.user.id]
    );

    if (!store.length)
      return error(res, 'Store not found or unauthorized', 404);

    const image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      `INSERT INTO products 
      (store_id, genre_id, book_type_id, name, description, price, quantity, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        store_id,
        genre_id || null,
        book_type_id || null,
        name,
        description || null,
        price,
        quantity,
        image
      ]
    );

    return success(
      res,
      {
        id: result.insertId,
        name,
        price,
        quantity,
        image: imgUrl(req, image)
      },
      'Product created',
      201
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Get all products (public, optional filters) ──────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    const { store_id, genre_id, book_type_id, search } = req.query;

    let query = `
      SELECT 
        p.*, 
        g.name AS genre_name, 
        bt.name AS book_type_name, 
        s.store_name
      FROM products p
      LEFT JOIN genres g ON p.genre_id = g.id
      LEFT JOIN book_types bt ON p.book_type_id = bt.id
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE 1=1
    `;

    const params = [];

    if (store_id) {
      query += ' AND p.store_id = ?';
      params.push(store_id);
    }

    if (genre_id) {
      query += ' AND p.genre_id = ?';
      params.push(genre_id);
    }

    if (book_type_id) {
      query += ' AND p.book_type_id = ?';
      params.push(book_type_id);
    }

    if (search) {
      query += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }

    const [products] = await db.query(query, params);

    const mapped = products.map(p => ({
      ...p,
      image: imgUrl(req, p.image)
    }));

    return success(res, mapped);
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Get single product ───────────────────────────────────────────────────────
exports.getProduct = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.*, 
        g.name AS genre_name, 
        bt.name AS book_type_name, 
        s.store_name
      FROM products p
      LEFT JOIN genres g ON p.genre_id = g.id
      LEFT JOIN book_types bt ON p.book_type_id = bt.id
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.id = ?
      `,
      [req.params.id]
    );

    if (!rows.length)
      return error(res, 'Product not found', 404);

    return success(res, {
      ...rows[0],
      image: imgUrl(req, rows[0].image)
    });
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Update product ───────────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT p.* FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE p.id = ? AND s.merchant_id = ?
      `,
      [req.params.id, req.user.id]
    );

    if (!rows.length)
      return error(res, 'Product not found or unauthorized', 404);

    const old = rows[0];

    const {
      genre_id,
      book_type_id,
      name,
      description,
      price,
      quantity
    } = req.body;

    let image = old.image;

    if (req.file) {
      if (image) {
        const oldPath = path.join(
          __dirname,
          '../../uploads/product-images',
          image
        );

        if (fs.existsSync(oldPath))
          fs.unlinkSync(oldPath);
      }

      image = req.file.filename;
    }

    await db.query(
      `
      UPDATE products 
      SET 
        genre_id = ?, 
        book_type_id = ?, 
        name = ?, 
        description = ?, 
        price = ?, 
        quantity = ?, 
        image = ?
      WHERE id = ?
      `,
      [
        genre_id ?? old.genre_id,
        book_type_id ?? old.book_type_id,
        name || old.name,
        description ?? old.description,
        price ?? old.price,
        quantity ?? old.quantity,
        image,
        req.params.id
      ]
    );

    return success(
      res,
      {
        id: Number(req.params.id),
        image: imgUrl(req, image)
      },
      'Product updated'
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Delete product ───────────────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT p.* FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE p.id = ? AND s.merchant_id = ?
      `,
      [req.params.id, req.user.id]
    );

    if (!rows.length)
      return error(res, 'Product not found or unauthorized', 404);

    if (rows[0].image) {
      const imgPath = path.join(
        __dirname,
        '../../uploads/product-images',
        rows[0].image
      );

      if (fs.existsSync(imgPath))
        fs.unlinkSync(imgPath);
    }

    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    return success(res, {}, 'Product deleted');
  } catch (err) {
    return error(res, err.message);
  }
};