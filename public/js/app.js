'use strict';

const socket = io();
const input = document.getElementById('input');
const button = document.getElementById('button');
const userName = document.querySelector('input[hidden]');
const chatBox = document.getElementById('chat-content')
const form = document.getElementById('sendMessage')
let typing = false;
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
userName.value = username;
const usernametoclass = username.split(' ').join('');
socket.emit('joinRoom', {
    username,
    room
});
input.addEventListener('change', handleKeyPress);

function handleKeyPress(event) {
    if (input.value.length > 0) {
        typing = true;
    } else {
        typing = false;
    }
    socket.emit('typing', {username, typing});
}
document.getElementById('room-name').innerHTML = room.toUpperCase() + " => Chat Room"

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value) {
        let typing = false;
        let message = input.value;
        socket.emit('chatMessage',
            message
        );
        socket.emit('typing', {username, typing})
        input.value = '';
        input.focus();
    }
});



socket.on('message', payload => {
    const inputmsg = payload.text;
    const p = document.createElement('p');
    p.innerText = inputmsg;
    const sender = payload.username;
    if (!chatBox.lastElementChild.classList.contains(sender.toLowerCase().split(' ').join(''))) {
        outputMessage(p, sender, payload);
    } else {
        let msg = '';
        if (!(sender.toLowerCase().split(' ').join('') == username.toLowerCase().split(' ').join(''))) {

            msg = `<div class="msg_cotainer">
                                ${p.innerText}
                                <span class="msg_time">${payload.time}</span>
                            </div>`;
        } else {
            msg = `<div class="msg_cotainer_send">
                                ${p.innerText}
                                <span class="msg_time">${payload.time}</span>
                            </div>`;
        }
        chatBox.lastElementChild.innerHTML += msg;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
});

function outputMessage(p, sender, payload) {
    // const newMessage = document.createElement('div');
    // const img = document.createElement('img');
    // const span = document.createElement('span');
    // const div2 = document.createElement('div');
    // newMessage.classList.add('media')
    // newMessage.classList.add('media-chat')
    // newMessage.classList.add(sender.split(' ').join(''));
    // img.classList.add('avatar');
    // img.src = 'https://img.icons8.com/color/36/000000/administrator-male.png';
    // div2.classList.add('media-body');
    // span.append(img);
    // const strong = document.createElement('strong');
    // strong.innerHTML = sender.toUpperCase();
    // span.append(strong);
    // newMessage.append(span);
    // newMessage.append(div2);
    // div2.append(p);
    // chatBox.append(newMessage);
    let appendMessage = '';
    if (sender.toLowerCase().split(' ').join('') == username.toLowerCase().split(' ').join('')) {
        appendMessage = ` <div class="d-flex msg_div justify-content-end mb-4 ${sender.toLowerCase().split(' ').join('')}">
        <div class="img_cont_msg">
            <img src="https://img.icons8.com/color/36/000000/administrator-male.png" class="rounded-circle user_img_msg">
            <strong> ${sender}</strong>
        </div>
                            <div class="msg_cotainer_send">
                                 ${p.innerText}
                                <span class="msg_time">${payload.time}</span>
                            </div>
                        </div>`
    } else {
        appendMessage = `<div class="d-flex msg_div justify-content-start mb-4 ${sender.toLowerCase().split(' ').join('')}">
        <div class="img_cont_msg">
        <img src="https://img.icons8.com/color/36/000000/administrator-male.png"
        class="rounded-circle user_img_msg"> <strong> ${sender}</strong>
        </div>
        <div class="msg_cotainer">
        ${p.innerText}
        <span class="msg_time">${payload.time}</span>
        </div>
        </div>`;
    }
    chatBox.innerHTML += appendMessage;
}
// const roomName = document.querySelector('.publisher-btn').value.split(' ')[0].toLowerCase();
socket.on('roomUsers', ({
    room,
    users
}) => {
    outputUsers(users);
});
const userList = document.getElementById('users');

function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        // li.innerText = user.username;
        li.innerHTML = ` <div class="d-flex bd-highlight">
                                    <div class="img_cont">
                                        <img src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                            class="rounded-circle user_img">
                                    </div>
                                    <div class="user_info">
                                        <span>${user.username}</span>
                                    </div>
                                </div>`;
        userList.appendChild(li);
    });
}

document.getElementById('leave-btn').addEventListener('click', () => {
    window.location = '/';
});

socket.on('typing', load => {
    if (load.typing == true) {
        document.querySelector('.istyping').innerText = load.username + " is typing ...";
    } else {
        document.querySelector('.istyping').innerText ='';
    }
});