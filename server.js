var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];


app.use(express.static('public'));

io.on('connection', function(socket){

    socket.on('disconnect', function(){

        console.log(socket.username + 'left');

        users.splice(users.indexOf(socket.username), 1);

        updateUsers();

        socket.broadcast.emit('user left', {
            username: socket.username
        });


    });

    socket.on('chat msg', function(msg){
        io.emit('chat msg', {
            msg: msg,
            username: socket.username
        });
    });

    socket.on('add user', function(username){
        socket.username = username;

        users.push(socket.username);
        updateUsers();

        socket.broadcast.emit('user joined', {
            username: socket.username
        });

        socket.emit('show username', socket.username);
    });

    socket.on('change uesrname', function (newUsername) {
        console.log('change username');

        if  (newUsername === socket.username){
            return false
        }
       
        socket.broadcast.emit('reportUsersNewUsername', {
            newUsername: newUsername,
            oldUsername: socket.username
        });

        socket.emit('reportUserNewUsername', true);
       
        users.splice(users.indexOf(socket.username), 1);
        socket.username = newUsername;
        users.push(socket.username);

        updateUsers();
    });

    function updateUsers() {
        io.sockets.emit('get users', users);
    }

    

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
