const db = require('../config/db')
const { success, error } = require('../utils/response')

exports.getAllMerchants = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, created_at FROM merchants ORDER BY created_at DESC'
    )
    return success(res, rows)
  } catch (err) {
    return error(res, err.message)
  }
}

exports.getMerchant = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, created_at FROM merchants WHERE id = ?',
      [req.params.id]
    )
    if (!rows.length) return error(res, 'Merchant not found', 404)
    return success(res, rows[0])
  } catch (err) {
    return error(res, err.message)
  }
}

exports.deleteMerchant = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM merchants WHERE id = ?',
      [req.params.id]
    )
    if (!rows.length) return error(res, 'Merchant not found', 404)
    await db.query('DELETE FROM merchants WHERE id = ?', [req.params.id])
    return success(res, { id: Number(req.params.id) }, 'Merchant deleted')
  } catch (err) {
    return error(res, err.message)
  }
}