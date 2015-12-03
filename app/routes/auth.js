var express = require('express');

module.exports = (function () {
    'use strict';
    var auth = express.Router();
    auth.post('/login', function (req, res) {

    });

    auth.post('/refresh', function (req, res){

    });

    auth.post('/register', function (req, res){

    });

    return auth;
})();