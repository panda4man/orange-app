var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    port = 4200;

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

app.get('/', function(req, res, next) {
    res.sendFile('/index.html');
});

server.listen(port, function() {
    console.log('Server listening on port: ' + port);
});


io.sockets.on('connection', function(socket) {
    console.log('a user connected');

    //emitters
    socket.emit('message', {
        message: 'welcome to the chat'
    });

    //listeners
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('chat:typing', function () {
    	socket.broadcast.emit('chat:typing');
    });
    socket.on('chat:typing-stopped', function () {
    	socket.broadcast.emit('chat:typing-stopped');
    });
    socket.on('chat:message', function(msg) {
        console.log('message: ' + msg);
        socket.broadcast.emit('chat:message', msg);
    });
});
