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
const ammanChat = io.of('/chat-room/amman');


app.get('/', (req, res) => {
    res.render('login') 
});

let name;
app.post('/chat-room/', (req, res) => {
    // res.render('index', req.body);
    res.redirect(`/chat-room/${req.body.room}`)
    name= req.body.name

});

app.get('/chat-room/amman', (req, res) => {
    // console.log(req.query.name);
    // console.log(name);
    res.render('index', {name: name})
})


io.on('connection', (socket) => {
    console.log("connected to client:", socket.id);
    socket.on('chat', socket => {
        io.sockets.emit('message', socket);
    });
    
});


ammanChat.on('connection', (socket) => {
    console.log('from amman space');
})

function run(PORT) {
    server.listen(PORT, () => {
        console.log("Connected to server on", PORT);
    });
}

module.exports = {
    run
}