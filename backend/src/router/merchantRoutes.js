const router = require('express').Router()
const c = require('../controllers/merchantController')
const { authenticate } = require('../middleware/auth')

router.get('/',     authenticate, c.getAllMerchants)
router.get('/:id',  authenticate, c.getMerchant)
router.delete('/:id', authenticate, c.deleteMerchant)

module.exports = router