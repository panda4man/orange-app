var express = require('express'),
    router = express.Router(),
    auth_middle = require('../middleware/auth');

router.use('/auth', require('../controllers/AuthController'));
router.use('/', require('../controllers/HomeController'));
router.use('/api', auth_middle, require('./api'));

module.exports = router;