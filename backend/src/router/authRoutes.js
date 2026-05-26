const router = require('express').Router();
const { registerUser, loginUser, registerMerchant, loginMerchant } = require('../controllers/authController');

router.post('/user/register',     registerUser);
router.post('/user/login',        loginUser);
router.post('/merchant/register', registerMerchant);
router.post('/merchant/login',    loginMerchant);

module.exports = router;
