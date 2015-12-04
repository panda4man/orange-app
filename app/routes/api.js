var express = require('express'),
    router = express.Router();

router.use('/users', require('../controllers/api/UsersController'));

module.exports = router;
