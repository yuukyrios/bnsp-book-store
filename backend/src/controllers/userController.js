const db = require('../config/db')
const { success, error } = require('../utils/response')

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
    )
    return success(res, rows)
  } catch (err) {
    return error(res, err.message)
  }
}

exports.getUser = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.params.id]
    )
    if (!rows.length) return error(res, 'User not found', 404)
    return success(res, rows[0])
  } catch (err) {
    return error(res, err.message)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    )
    if (!rows.length) return error(res, 'User not found', 404)
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id])
    return success(res, { id: Number(req.params.id) }, 'User deleted')
  } catch (err) {
    return error(res, err.message)
  }
}