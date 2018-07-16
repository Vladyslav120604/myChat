var loginPage = $('.login_page');
var chatPage = $('.chat_page');
var usernameInput = $('.usernameInput');
var loginUsername = $('#loginUsername');
var messageInput = $('#m');
var typing = false;
var socket = io();

chatPage.hide();

$(function (){
    $('#message_form').submit(function(){
        socket.emit('chat msg', messageInput.val());
        messageInput.val('');

        return false
    });

    $('.login_form').submit(function(){
        var username = loginUsername.val();

        if(username){
            socket.emit('add user', username);
            loginUsername.val('');

            loginPage.hide();
            chatPage.show();

        }
        return false
    });

    $('#changeUsernameBtn').click(function(){
        socket.emit('change uesrname', usernameInput.val());
        return false
    });





    socket.on('chat msg', function(msg){
        $('#messages').append($('<li>').html('<b>' + msg.username + ' </b>' + msg.msg));
    });

    socket.on('user joined', function(msg){
        $('#messages').append($('<li class="centered">').html('<b>' + msg.username + '</b>'  + ' joined :) '));
    });

    socket.on('user left', function(msg){
        $('#messages').append($('<li class="centered">').html('<b>' + msg.username + '</b>'  + ' left :( '));
    });

    socket.on('get users', function (data) {
        $('#onlineUsers').empty();

        for (let i = 0; i < data.length; i++) {
            $('#onlineUsers').append($('<li>').text(data[i]));
        }
        
    });

    socket.on('show username', function(username){
        usernameInput.val(username);
    });

    socket.on('reportUsersNewUsername', function (data) {
        $('#messages').append($('<li class="centered">').html('user ' + '<b>' + data.oldUsername + '</b>' + ' renamed his nickname to ' + '<b>' +  data.newUsername + '</b>'));
        
    });

    socket.on('reportUserNewUsername', function (data) {
        $('#messages').append($('<li class="centered">').html('Your username was successfully renamed'));
        
    });
})