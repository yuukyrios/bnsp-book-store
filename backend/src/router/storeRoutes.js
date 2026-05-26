const router = require('express').Router();
const { authenticate, isMerchant } = require('../middleware/auth');
const { uploadStoreLogo } = require('../config/multer');
const ctrl = require('../controllers/storeController');

router.get('/:id',                                      ctrl.getStore);       // public
router.get('/',    authenticate, isMerchant,            ctrl.getMyStores);    // merchant's stores
router.post('/',   authenticate, isMerchant, uploadStoreLogo.single('store_logo'), ctrl.createStore);
router.put('/:id', authenticate, isMerchant, uploadStoreLogo.single('store_logo'), ctrl.updateStore);
router.delete('/:id', authenticate, isMerchant,         ctrl.deleteStore);

module.exports = router;
