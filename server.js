const express = require('express');
// setup express
const app = express();
// this is from creating the socket.io server
const http = require('http').createServer(app)
// initialize the port 
const PORT = process.env.PORT || 3000;

// static routers middleware
app.use(express.static(__dirname + '/public'))

// routes

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


// Socket io
const io = require('socket.io')(http);
// function definition
io.on('connection', (socket) => {
    // console.log('connect');
    socket.on('message', (msg) => {
        // console.log(msg); //message from client
        socket.broadcast.emit('message', msg);
        // broadcast means it will send the message to all other clients than to itself.
    })
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    })

})

// listen the server

http.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);

})
