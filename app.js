var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = 4200;

    app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res, next) {
    res.sendFile('/index.html');
});

server.listen(port, function() {
	console.log('Server listening on port: ' + port);
});
