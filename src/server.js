'use strict';

const express = require('express')
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.get('/chat-room', (req, res) => {
    //     res.render('index');
    // });
    app.get('/', (req, res) => {
        res.render('login') 
    });
    app.post('/chat-room', (req, res) => {
        res.render('index', req.body);
    });
    
    const ammanChat = io.of('/amman-chat');

io.on('connection', (socket) => {
    console.log("connected to client:", socket.id);
    socket.on('chat', socket => {
        io.sockets.emit('message', socket);
    });

});


function run(PORT) {
    server.listen(PORT, () => {
        console.log("Connected to server on", PORT);
    });
}

module.exports = {
    run
}