const socket = io('http://localhost:8000');

// Get DOM elements in respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container'); // if message is being received, put it in container

// Audio that will be played on receiving messages
// const audio = new Audio('tone.mp3'); // can't play audio, so to play used 'audio' tag in html


// Function which will append event info to the container
// appending the input tag in '.container' class in index.html
const append = (message, position)=>{
  const messageElement = document.createElement('div');
  messageElement.innerText=message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);

  // playing audio on receiving message
  if(position=='left'){
    // audio.play();
    document.getElementById('myAudio').play();
  }

}


// when a user is joined
// Ask new user for his/her name and let the server know
const name1 = prompt("Enter your name to join...");
socket.emit('new-user-joined', name1);

// If the new user joins, receive his/her name from the server
socket.on('user-joined', name => {
  append(`${name} joined the chat`, 'right');
})

// If server sends a message, receive it
socket.on('receive', data => {
  append(`${data.name}: ${data.message}`, 'left');
})

// If a user leaves the chat, append the info to the container
socket.on('leave', name => {
  append(`${name} left the chat.`, 'right');
})


// when form is being submitted, send server the message 
form.addEventListener('submit', (e)=>{
  e.preventDefault(); // page will not be reloaded on submitting
  const message = messageInput.value;
  append(`You: ${message}`, 'right');
  socket.emit('send', message);
  // to empty the input place-holder after sending a message
  messageInput.value = '';
})
