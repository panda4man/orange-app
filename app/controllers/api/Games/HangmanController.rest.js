var express = require('express');
var Hangman = require('../../../models/hangman');
var router = express.Router();

router.get('/', function(req, res) {
    Hangman.find({}).populate('players').populate('owner').exec(function(err, games) {
        if (err) return res.status(400).json(err);

        res.status(200).json({
            success: true,
            data: games
        });
    });
});

router.delete('/:id', function(req, res) {
    Hangman.findById(req.params.id, function(err, game) {
        if (err) return res.status(400).json(err);

        if (!game) {
            res.status(400).json({
                success: false,
                error: 'Could not find game.'
            });
        } else {
            game.remove(function(err) {
                if (err)
                    res.status(400).json(err);
                else
                    res.status(200).json({
                        success: true,
                        message: 'Deleted game.'
                    });
            });
        }
    });
});

module.exports = router;
