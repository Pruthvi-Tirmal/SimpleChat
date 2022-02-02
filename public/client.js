//this io() is coming from server.js
const socket = io();

let textarea = document.querySelector('textarea');
let messageArea = document.querySelector('.simpleChat__messageArea');
let typingSpan = document.querySelector('span');
let username;
do {
    username = prompt('Please enter your name');
} while (!username)

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
        e.target.value = "";
    }
    socket.emit("typing", { username: username });
})

const sendMessage = (message) => {
    let msg = {
        user: username,
        message: message.trim()
    }
    // append
    appendMessage(msg, 'simpleChat__messageArea__outgoing');
    // scroll the bottom only
    scrollBottom();
    // send to server
    socket.emit('message', msg);
}

const appendMessage = (msg, type) => {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'simpleChat__messageArea--message');

    let markup = `
     <h4>${msg.user}</h4>
     <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);

}


// Receive the incoming messages 
socket.on('message', (msg) => {
    // console.log(msg);
    // append the message
    appendMessage(msg, 'simpleChat__messageArea__incoming');
    // scroll bottom
    scrollBottom();
})
// this very important to create the debounce
let timerId = null;

const debounce = (func, timer) => {
    if (timerId) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
        func(); // this function call for debounce function
    }, timer)
}
// typing status
socket.on('typing', (data) => {
    typingSpan.innerHTML = `${data.username} is typing...`;
    debounce(() => {
        typingSpan.innerHTML = " ";
    }, 1000)
})

// always to bottom
const scrollBottom = () => {
    messageArea.scrollTop = messageArea.scrollHeight;
}