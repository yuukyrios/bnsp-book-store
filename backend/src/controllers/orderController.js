const db = require('../config/db');
const { success, error } = require('../utils/response');

const VALID_STATUSES = ['processed', 'on the way', 'arrived'];

// ─── User: Place an order ─────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { product_id, quantity = 1, message } = req.body;

    if (!product_id)
      return error(res, 'product_id is required', 400);

    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [product_id]
    );

    if (!products.length)
      return error(res, 'Product not found', 404);

    const product = products[0];

    if (product.quantity < quantity)
      return error(res, 'Insufficient product quantity', 400);

    const total_price = (
      parseFloat(product.price) * quantity
    ).toFixed(2);

    // Snapshot product image at order time
    const product_image = product.image
      ? `http://localhost:5000/uploads/product-images/${require('path').basename(product.image)}`
      : null;

    // Deduct stock
    await db.query(
      'UPDATE products SET quantity = quantity - ? WHERE id = ?',
      [quantity, product_id]
    );

    await db.query(
      'INSERT INTO orders (user_id, product_id, product_image, quantity, message, total_price) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, product_id, product_image, quantity, message || null, total_price]
    );

    return success(
      res,
      {
        product_id,
        product_image,
        quantity,
        message: message || null,
        total_price,
        status: 'processed'
      },
      'Order placed',
      201
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── User: Get my orders ──────────────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        o.*,
        p.name AS product_name,
        COALESCE(o.product_image, p.image) AS product_image,
        s.store_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN stores s ON p.store_id = s.id
      WHERE o.user_id = ?
      ORDER BY o.ordered_at DESC`, [req.user.id]
    );

    return success(res, orders);
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── User: Get single order ───────────────────────────────────────────────────
exports.getOrder = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        o.*,
        p.name AS product_name,
        COALESCE(o.product_image, p.image) AS product_image,
        s.store_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN stores s ON p.store_id = s.id
      WHERE o.id = ? AND o.user_id = ?`, [req.params.id, req.user.id]
    );

    if (!rows.length)
      return error(res, 'Order not found', 404);

    return success(res, rows[0]);
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Merchant: Get orders for their stores ────────────────────────────────────
exports.getMerchantOrders = async (req, res) => {
  try {
    const { store_id, status } = req.query;

    let query = `
      SELECT
        o.*,
        p.name AS product_name,
        COALESCE(o.product_image, p.image) AS product_image,
        s.store_name,
        u.username AS buyer
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN stores s ON p.store_id = s.id
      JOIN users u ON o.user_id = u.id
      WHERE s.merchant_id = ?
    `;

    const params = [req.user.id];

    if (store_id) {
      query += ' AND s.id = ?';
      params.push(store_id);
    }

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.ordered_at DESC';

    const [orders] = await db.query(query, params);

    return success(res, orders);
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Merchant: Update delivery status ────────────────────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status))
      return error(
        res,
        `status must be one of: ${VALID_STATUSES.join(', ')}`,
        400
      );

    // Verify the order belongs to a store owned by this merchant
    const [rows] = await db.query(`
      SELECT o.id FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN stores s ON p.store_id = s.id
      WHERE o.id = ? AND s.merchant_id = ?`, [req.params.id, req.user.id]
    );

    if (!rows.length)
      return error(res, 'Order not found or unauthorized', 404);

    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    return success(
      res,
      { id: Number(req.params.id), status },
      'Order status updated'
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Delete an order ──────────────────────────────────────────────────────────
exports.deleteOrder = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM orders WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length)
      return error(res, 'Order not found', 404);

    await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);

    return success(res, { id: Number(req.params.id) }, 'Order deleted');
  } catch (err) {
    return error(res, err.message);
  }
};