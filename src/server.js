'use strict';

const express = require('express')
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const formatMessage = require("../handlers/messages");
const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
} = require('../handlers/user')
const chat = 'Chat House';
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// app.get('/chat-room', (req, res) => {
//     res.render('index');
// });
app.get('/', (req, res) => {
    res.render('login')
});
app.get('/chat-room', (req, res) => {
    res.render('chat', {});
});


io.on('connection', (socket) => {
    socket.on('joinRoom', ({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(chat, 'Welcome to Chat House!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(chat, `${user.username.toUpperCase()} has joined the chat`)
            );
                const {id} = socket
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            id,
            users: getRoomUsers(user.room)
        });
        socket.on('typing', load => {
                socket.broadcast.to(user.room).emit('typing', load);
            
        });
    });
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username.toUpperCase(), msg));
    });
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(chat, `${user.username.toUpperCase()} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
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