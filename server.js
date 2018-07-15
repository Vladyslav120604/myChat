var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log(socket.username + 'joined');


    socket.on('disconnect', function(){

        console.log(socket.username + 'left');

        socket.broadcast.emit('user left', {
            username: socket.username
        });
    });

    socket.on('chat msg', function(msg){
        io.emit('chat msg', {
            msg: msg,
            username: socket.username
        });
        // console.log(socket.username);
    });

    socket.on('add user', function(username){
        // socket.emit('chat msg', msg);
        socket.username = username;
        socket.broadcast.emit('user joined', {
            username: socket.username
        });
        // console.log(username + socket.username);
    });

    

})

http.listen(4000, function(){
  console.log('listening on *:4000');
});
