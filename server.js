var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [];
var lastId = 0;

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('*', function(req, res){
  res.redirect('/');
});

io.on('connection', function(socket){
  console.log('Usuario conectado');

  // Envía los últimos mensages al usuario recién conectado
  socket.emit('messages', messages);

  socket.on('disconnect', function(){
    console.log('Usuario desconectado');
  });

  // Cuando se envía un mensaje, lo guardamos y lo reenviamos
  // a los demás usuarios conectados.
  socket.on('message', function (message) {
    lastId += 1;
    message.id = lastId;
    message.time = new Date();
    if (messages.length > 100) {
      messages.shift();
    }
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
});

var server = http.listen(3000, function(){
  console.log('Servidor escuchando en *:%s', server.address().port);
});
