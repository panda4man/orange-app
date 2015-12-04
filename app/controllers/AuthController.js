var express = require('express');
var User = require('../models/user');
var auth_middle = require('../middleware/auth');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', function(req, res) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) return res.status(400).json({
            success: false,
            error: 'Could not find user.'
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            // check if password matches
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) return res.status(403).json(err);

                if (!isMatch) return res.status(403).json({
                    success: false,
                    error: 'Invalid credentials.'
                });

                var token = jwt.sign(user, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES // expires in 24 hours
                });

                User.findOne({
                    'username': req.body.username
                }, function(err, user) {
                    if (err) return res.status(403).json(err);

                    if (!user) {
                        res.status(403).json({
                            success: false,
                            error: 'Could not find user.'
                        });
                    } else {
                        // return the information including token as JSON
                        res.status(200).json({
                            success: true,
                            token: token,
                            user: user
                        });
                    }
                });
            });
        }
    })
});

router.post('/refresh', auth_middle, function(req, res) {

});

router.post('/register', function(req, res) {

});

module.exports = router;
