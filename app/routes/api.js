var express = require('express'),
    router = express.Router();

router.use('/users', require('../controllers/api/UsersController'));
router.use('/games/hangman', require('../controllers/api/Games/HangmanController.rest'));
module.exports = router;
