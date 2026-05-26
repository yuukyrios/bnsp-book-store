const router = require('express').Router();
const { authenticate, isMerchant } = require('../middleware/auth');
const { uploadProductImage } = require('../config/multer');
const ctrl = require('../controllers/productController');

router.get('/',    ctrl.getProducts);   // public - supports ?store_id, ?category_id, ?brand_id, ?search
router.get('/:id', ctrl.getProduct);    // public

router.post('/',    authenticate, isMerchant, uploadProductImage.single('image'), ctrl.createProduct);
router.put('/:id',  authenticate, isMerchant, uploadProductImage.single('image'), ctrl.updateProduct);
router.delete('/:id', authenticate, isMerchant, ctrl.deleteProduct);

module.exports = router;
