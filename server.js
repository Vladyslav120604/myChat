var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};
var onlineUsers = [];


app.use(express.static('public'));

io.on('connection', function(socket){

    socket.on('disconnect', function(){

        onlineUsers.splice(onlineUsers.indexOf(socket.username), 1);
        delete users[socket.username];

        updateOnlineUsers();

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

        
        users[socket.username] = socket.id;
        onlineUsers.push(socket.username);

        updateOnlineUsers();

        socket.broadcast.emit('user joined', {
            username: socket.username
        });

        socket.emit('show username', socket.username);
    });

    socket.on('change uesrname', function (newUsername) {

        if  (newUsername === socket.username){
            return false
        }
       
        socket.broadcast.emit('reportUsersNewUsername', {
            newUsername: newUsername,
            oldUsername: socket.username
        });
       
        delete users[socket.username];
        socket.username = newUsername;
        users[socket.username] = socket.id;

        onlineUsers.splice(onlineUsers.indexOf(socket.username), 1);
        onlineUsers.push(socket.username);

        socket.emit('reportUserNewUsername', true);

        updateOnlineUsers();
    });

    socket.on('privat chat msg', function(data){
        var id = getUserIdByUsername(data.to);

        socket.broadcast.to(id).emit('pm', {
            username: socket.username,
            msg: data.msg
        });

        socket.emit('pm', {
            username: socket.username,
            msg: data.msg
        });
    })

    function updateOnlineUsers() {
        io.sockets.emit('online users', onlineUsers);
    };

    function getUserIdByUsername(username) {
        return users[username]
    }



    

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
