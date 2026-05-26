const bcrypt = require('bcrypt');
const db = require('../config/db');
const { signToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');

const SALT_ROUNDS = 10;

// ─── User Auth ────────────────────────────────────────────────────────────────

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return error(res, 'username, email and password are required', 400);

    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?', [email, username]
    );
    if (existing.length) return error(res, 'Username or email already taken', 409);

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashed]
    );
    const token = signToken({ id: result.insertId, role: 'user' });
    return success(res, { token, user: { id: result.insertId, username, email } }, 'Registered successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'email and password are required', 400);

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return error(res, 'Invalid credentials', 401);

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(res, 'Invalid credentials', 401);

    const token = signToken({ id: user.id, role: 'user' });
    return success(res, { token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    return error(res, err.message);
  }
};

// ─── Merchant Auth ────────────────────────────────────────────────────────────

exports.registerMerchant = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return error(res, 'username, email and password are required', 400);

    const [existing] = await db.query(
      'SELECT id FROM merchants WHERE email = ? OR username = ?', [email, username]
    );
    if (existing.length) return error(res, 'Username or email already taken', 409);

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.query(
      'INSERT INTO merchants (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashed]
    );
    const token = signToken({ id: result.insertId, role: 'merchant' });
    return success(res, { token, merchant: { id: result.insertId, username, email } }, 'Registered successfully', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.loginMerchant = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'email and password are required', 400);

    const [rows] = await db.query('SELECT * FROM merchants WHERE email = ?', [email]);
    if (!rows.length) return error(res, 'Invalid credentials', 401);

    const merchant = rows[0];
    const match = await bcrypt.compare(password, merchant.password);
    if (!match) return error(res, 'Invalid credentials', 401);

    const token = signToken({ id: merchant.id, role: 'merchant' });
    return success(res, { token, merchant: { id: merchant.id, username: merchant.username, email: merchant.email } });
  } catch (err) {
    return error(res, err.message);
  }
};
