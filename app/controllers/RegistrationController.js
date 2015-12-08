var express = require('express'),
    router = express.Router(),
    User = require('../models/').user,
    jwt = require('../helpers/jwt');

router.post('/sign-up', require('../validators/register'), function(req, res) {
    var user = new User();
    user.fill(req.body);

    user.save(function(err) {
        if (err) return res.status(400).json(err);

        res.status(202).json({
            success: true,
            token: jwt.createToken(user),
            user: user
        });
    });
});

module.exports = router;
