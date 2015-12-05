var express = require('express');
var User = require('../../models/user');
var router = express.Router();

router.get('/', function(req, res) {
    User.find({}, function(err, users) {
        if (err) return res.status(400).json({
            success: false,
            error: err
        });

        res.status(200).json({
            success: true,
            data: users
        });
    });
});

router.route('/:id')
    .get(function(req, res) {
        User.findOne({
            '_id': req.params.id
        }, function(err, user) {
            if (err) return res.status(400).json(err);

            if (!user) {
                res.status(400).json({
                    success: false,
                    error: 'Could not find this user.'
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: user
                });
            }
        });
    })
    .put(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if (err) {
                res.status(400).json(err);
            } else {
                user.fill(req.body);
                user.save(function(err) {
                    if (err)
                        res.status(400).json(err);
                    else
                        res.status(200).json({
                            success: true,
                            data: user
                        });
                });
            }
        })
    });

router.get('/username/:username', function(req, res) {
    User.findOne({
        'username': req.params.username
    }, function(err, user) {
        if (err) return res.status(400).json(err);

        if (!user) {
            res.status(400).json({
                success: false,
                error: 'Could not find this user.'
            });
        } else {
            res.status(200).json({
                success: true,
                data: user
            });
        }
    });
});

module.exports = router;
