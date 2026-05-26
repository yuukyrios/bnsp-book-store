const router = require('express').Router();
const { authenticate, isMerchant, isUser } = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

// User routes
router.post('/',    authenticate, isUser, ctrl.createOrder);
router.get('/mine', authenticate, isUser, ctrl.getMyOrders);
router.get('/:id',  authenticate, isUser, ctrl.getOrder);

// Merchant routes
router.get('/merchant/all',          authenticate, isMerchant, ctrl.getMerchantOrders);
router.patch('/:id/status',          authenticate, isMerchant, ctrl.updateOrderStatus);
router.delete('/:id', authenticate, isMerchant, ctrl.deleteOrder);
module.exports = router;
