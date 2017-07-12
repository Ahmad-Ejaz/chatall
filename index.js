var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socketio = require('socket.io');
var io = socketio.listen(server);
var chatHandler = require('./chatHandler');

app.use(express.static(__dirname+'/public'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
})

var port = process.env.PORT || 4006;
server.listen(port, function(req, res) {
    console.log('server running at port ' + port);
})

var users = {};
chatHandler(io,users);
