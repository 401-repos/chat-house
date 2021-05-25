'use strict';

const socket = io('http://localhost:3000');
const socket2 = io('http://localhost:3000/amman-chat')
const input = document.getElementById('input');
const button = document.getElementById('button');
const userName = document.querySelector('input[hidden]').value;
const chatBox = document.getElementById('chat-content')
const form = document.getElementById('sendMessage')
const usernametoclass = userName.split(' ').join('');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value) {
        
        let message = input.value;
        socket.emit('chat', {
            message,
            usernametoclass
        });
        input.value = '';
        input.focus();
    }
});



socket.on('message', payload => {
    console.log(payload);
    const inputmsg = payload.message;
    const p = document.createElement('p');
    p.innerText = inputmsg;
    console.log(usernametoclass);
    console.log(chatBox.lastElementChild.classList);
    if (!chatBox.lastElementChild.classList.contains(payload.usernametoclass)) {
        const newMessage = document.createElement('div');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const div2 = document.createElement('div');
        newMessage.classList.add('media')
        newMessage.classList.add('media-chat')
        newMessage.classList.add(payload.usernametoclass);
        img.classList.add('avatar');
        img.src = 'https://img.icons8.com/color/36/000000/administrator-male.png';
        div2.classList.add('media-body');
        span.append(img);
        span.append(payload.usernametoclass);
        newMessage.append(span);
        newMessage.append(div2);
        div2.append(p);
        chatBox.append(newMessage);
    } else {
        chatBox.lastElementChild.lastElementChild.append(p);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
});

