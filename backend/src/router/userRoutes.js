const router = require('express').Router()
const c = require('../controllers/userController')
const { authenticate } = require('../middleware/auth')

router.get('/',     authenticate, c.getAllUsers)
router.get('/:id',  authenticate, c.getUser)
router.delete('/:id', authenticate, c.deleteUser)

module.exports = router