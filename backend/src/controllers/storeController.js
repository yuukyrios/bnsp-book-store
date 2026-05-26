const db = require('../config/db');
const { success, error } = require('../utils/response');
const fs = require('fs');
const path = require('path');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const logoUrl = (req, filename) =>
  filename ? `${req.protocol}://${req.get('host')}/uploads/store-logos/${filename}` : null;

// ─── Create store ─────────────────────────────────────────────────────────────
exports.createStore = async (req, res) => {
  try {
    const { store_name } = req.body;
    if (!store_name) return error(res, 'store_name is required', 400);

    const logo = req.file ? req.file.filename : null;
    const [result] = await db.query(
      'INSERT INTO stores (merchant_id, store_name, store_logo) VALUES (?, ?, ?)',
      [req.user.id, store_name, logo]
    );
    return success(res, { id: result.insertId, store_name, store_logo: logoUrl(req, logo) }, 'Store created', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Get all stores of logged-in merchant ─────────────────────────────────────
exports.getMyStores = async (req, res) => {
  try {
    const [stores] = await db.query('SELECT * FROM stores WHERE merchant_id = ?', [req.user.id]);
    const mapped = stores.map(s => ({ ...s, store_logo: logoUrl(req, s.store_logo) }));
    return success(res, mapped);
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Get single store (public) ────────────────────────────────────────────────
exports.getStore = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stores WHERE id = ?', [req.params.id]);
    if (!rows.length) return error(res, 'Store not found', 404);
    const store = { ...rows[0], store_logo: logoUrl(req, rows[0].store_logo) };
    return success(res, store);
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Update store ─────────────────────────────────────────────────────────────
exports.updateStore = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stores WHERE id = ? AND merchant_id = ?', [req.params.id, req.user.id]);
    if (!rows.length) return error(res, 'Store not found or unauthorized', 404);

    const store_name = req.body.store_name || rows[0].store_name;
    let logo = rows[0].store_logo;

    if (req.file) {
      // Delete old logo file if it exists
      if (logo) {
        const oldPath = path.join(__dirname, '../../uploads/store-logos', logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      logo = req.file.filename;
    }

    await db.query('UPDATE stores SET store_name = ?, store_logo = ? WHERE id = ?', [store_name, logo, req.params.id]);
    return success(res, { id: Number(req.params.id), store_name, store_logo: logoUrl(req, logo) }, 'Store updated');
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Delete store ─────────────────────────────────────────────────────────────
exports.deleteStore = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stores WHERE id = ? AND merchant_id = ?', [req.params.id, req.user.id]);
    if (!rows.length) return error(res, 'Store not found or unauthorized', 404);

    if (rows[0].store_logo) {
      const logoPath = path.join(__dirname, '../../uploads/store-logos', rows[0].store_logo);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }

    await db.query('DELETE FROM stores WHERE id = ?', [req.params.id]);
    return success(res, {}, 'Store deleted');
  } catch (err) {
    return error(res, err.message);
  }
};
