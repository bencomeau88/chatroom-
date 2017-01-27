String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// this is the backend part of the code
var onlineList = [];
var onlineObj = {};
var socket_io = require('socket.io');
var express = require('express');
var http = require('http');
var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function(socket){
  console.log('Client connected');

  socket.on('logMessage', function(message){
    socket.broadcast.emit('logMessage', message);
  });

  socket.on('message', function(message) {
       console.log('Received message:', message);
      //  broadcast 'message' to everyother socket aka user/nickname
       socket.broadcast.emit('message', message);
       socket.broadcast.emit('notTyping');
   });
   socket.on('typing', function(nickname){
     console.log(nickname + " is typing")
     socket.broadcast.emit('typing', nickname);
   });
  //  socket.emit()sends back just to THIS socket
  // socket.broadcast.emit()sends to every socket but the one that send info
  socket.on('userReg', function(nickname){
    onlineObj[nickname] = socket;
    socket.nickname = nickname;
    onlineList.push(nickname);
    socket.broadcast.emit('logMessage', nickname + '<em>' + ' has just logged in' + '</em>');
    // sends to ALL sockets, socket.emit would send only to the one socket
    io.emit('userList', onlineList);
  });
  socket.on('disconnect', function(){
    var index = onlineList.indexOf(socket.nickname);
    console.log(index);
    // mutator method, changes the array they operate on..don'
    // need to push information back to onlineList arr.
    var removed = onlineList.splice(index, 1);
    socket.broadcast.emit('userList', onlineList);
    socket.broadcast.emit('logMessage', socket.nickname + "<em>" + ' has just logged out :(' + "</em>");
  });
  // step 1) what should you do when you see a privateMessage event in the backend?
  // need to get the nickname and associated socket{} associated with it.
  socket.on('privateMessage', function(pm, nickname){
    console.log(pm);
    // how do I broadcast it to the individual I clicked on?
    console.log(nickname + " nickname");
    console.log(onlineList);
    // @// TODO: FIGURE OUT HOW TO SEND PRIVATE MESSAGES TO SOCKETS THAT YOU TARGET ON THE FRONTEND
    nickname = nickname.toLowerCase();
    socket.broadcast.to(onlineObj[nickname]).emit('privateMessage', pm);
  });
});


// why server instead of app.listen?
server.listen(process.env.PORT || 8080);
