// This is the front end portion of the code

$(document).ready(function() {
  // input bar

  var input = $('input');
// add a nickname for each user
var nickname = prompt('What is your nickname?');
$('#nickname').html(nickname);
var socket = io();
socket.emit('userReg', nickname);
// Sending a private message to clicked on user
  $('#online').on('click', 'div', function(event){
    var target = event.target;
    var nickname = $(target).text();
    // click listener
    console.log(this)
    var pm = prompt('What private message do you want to send to ' + nickname + "?");
    socket.emit('privateMessage', pm, nickname);
  });

var message = function(nickname){
    $(this).text(console.log('you clicked'));
}
var online = function(nicknames){
  $('#online').html(nicknames.map(function(nickname){return $("<div>" + nickname + "</div>")}))
}
// broadcast a message when a user connects, or disconnects
  // DONE see the backend
// add "{nickname} + is typing" message when typing
var userTyping = function(nickname){
  $('#typing').html(nickname + " is typing")
}
// remove typing when not typing
var clearUserTyping = function(){
    $('#typing').html('');
}

  //add private messaging

  // Each time I append someone to the "onlineList" I will then add their name in an <a> tag..once clicked the tag will allow PMs


    var messages = $('#messages');

    var privateMessage = function(message){
      messages.append('<div>' + message + '</div>');
    };


    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
             socket.emit('typing', nickname);
             return
        }
        var message = input.val();
        addMessage(message);
        socket.emit('message', message);
        input.val('');
    });
    // how do you display the private message after you have recieved it?
    socket.on('privateMessage', privateMessage);
    socket.on('userList', online);
    socket.on('message', addMessage);
    socket.on('typing', userTyping);
    // listens for "notTyping" event on the back end then runs clearUserTyping()
    socket.on('notTyping', clearUserTyping);
});
