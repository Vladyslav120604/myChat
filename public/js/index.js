var loginPage = $('.login_page');
var chatPage = $('.chat_page');
var usernameInput = $('.usernameInput');
var loginUsername = $('#loginUsername');
var messageInput = $('#m');
var typing = false;
var socket = io();
var privatRegExp = /(\@)\w+/g;
var usernamePrivatRegExp = /@(\w+)/g;

chatPage.hide();

$(function (){
    function checkForPrivacyMsg(msg){
        if(msg.search(privatRegExp) != -1){
            return true
        }

        else{
            return false
        }
    };

    function getPrivatUsername(msg){
        return usernamePrivatRegExp.exec(msg)[1];
    }

    function getCorrectMsg(msg){
        msg = msg.replace(usernamePrivatRegExp, '');
        return msg;

    }


    $('#message_form').submit(function(){

        if(checkForPrivacyMsg(messageInput.val()) == true){
            privatUsername = getPrivatUsername(messageInput.val());
            msg = getCorrectMsg(messageInput.val());

            socket.emit('privat chat msg', {
                to: privatUsername,
                msg: msg
            });
        }

        else{
            socket.emit('chat msg', messageInput.val());  
        }
        
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





    socket.on('chat msg', function(data){
        $('#messages').append($('<li>').html('<b>' + data.username + ' </b>' + data.msg));
    });

    socket.on('user joined', function(msg){
        $('#messages').append($('<li class="centered">').html('<b>' + msg.username + '</b>'  + ' joined :) '));
    });

    socket.on('user left', function(msg){
        $('#messages').append($('<li class="centered">').html('<b>' + msg.username + '</b>'  + ' left :( '));
    });

    socket.on('online users', function (data) {
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

    socket.on('pm', function(data){
        $('#messages').append($('<li>').html('<b>' + data.username + ' </b>' + data.msg));
    });

})