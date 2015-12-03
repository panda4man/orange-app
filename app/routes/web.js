var express = require('express');

module.exports = (function() {
    'use strict';
    var web = express.Router();
    web.get('/', function(req, res) {
        res.sendFile('/index.html');
    });

    return web;
})();
