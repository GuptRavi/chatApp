// chat App Using 'socket.io' model
// Node server which will handle socket io connections
// const io = require('socket.io')(8000) // desired port can be used (8000)
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

// for the users, those who will connect to server
const users = {};

// when connection is encounterd, run 'socket' arrow funtion
// io.on --> socket.io instance, which will listen to more than one connection (users joinong the chat)
io.on('connection', socket =>{
  
  socket.on('new-user-joined', name =>{ // this will handle a particular connection/event, joined by a user
    console.log(`New user '${name}' Joined the chatRoom.`); // it will show the user connected in terminal
    // When a user is joined what to do
    users[socket.id] = name; // give 'socket.id' key to the user and give it a 'name'
    socket.broadcast.emit('user-joined', name); // informing all the users that a user has joined the chat with user name
  });

  // if chat message is involved, do this (sending message and broadcasting)
  socket.on('send', message =>{
    // make receive that message to all user, and show the name of sender
    socket.broadcast.emit('receive', {message : message, name : users[socket.id]});
  });

  // if any user disconnected or leaves the chat, let others know
  socket.on('disconnect', message =>{
    // make receive a message to all user, and show the name user who left the chat
    socket.broadcast.emit('leave', users[socket.id]);
    delete users[socket.id];
  });

})
