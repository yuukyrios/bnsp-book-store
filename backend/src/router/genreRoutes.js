const router = require('express').Router();
const { authenticate, isMerchant } = require('../middleware/auth');
const ctrl = require('../controllers/genreController');

router.get('/',       ctrl.getAll);
router.post('/',      authenticate, isMerchant, ctrl.create);
router.put('/:id',    authenticate, isMerchant, ctrl.update);
router.delete('/:id', authenticate, isMerchant, ctrl.remove);

module.exports = router;
