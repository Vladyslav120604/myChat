var socket = io();
$(function (){
    $('form').submit(function(){
        socket.emit('chat msg', $('#m').val());
        $('#m').val('');
        return false
    })
    socket.on('chat msg', function(msg){
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('user joined', function(msg){
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('user left', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
})