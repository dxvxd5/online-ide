// // USER SOCKET CONNECTION:
// // Everytime user logs in we want them to join the room "myChat"
// // For every user to be able to chat with other users
// socket.join('myChat');

// // Listen for "handle-connection" event
// socket.on('handle-connection', (user: { id: string; username: string }) => {
//   // If user already is logged in:
//   if (!userJoin(socket.id, user.username)) {
//     socket.emit('username-token');
//   } else {
//     socket.emit('username-submitted-successfully');
//     // Emits the message "get-connected-users" to "myChat"
//     io.to('myChat').emit('get-connected-users', getUsers());
//   }
// });

// socket.on('message', (message: { message: string; username: string }) => {
//   socket.broadcast.to('myChat').emit('receive-message', message);
// });

// socket.on('disconnect', () => {
//   userLeave(socket.id);
// });

// // ROOM SOCKET CONNECTION:
// socket.on('room', (data) => {
//   console.log('in joining room in SERVER');
//   socket.join(data.room);
//   console.log('Data: ', data);
//   socket.broadcast.to(data.room).emit('load users and code');
//   socket.broadcast.to(data.room).emit('new user join', data.user);
// });

// socket.on('leave room', (data) => {
//   socket.broadcast
//     .to(data.room)
//     .emit('user left room', { user: data.user });
//   socket.leave(data.room);
// });

// socket.on('coding event', (data) => {
//   console.log('in EXPRESS coding event');
//   console.log(data);
//   socket.broadcast.to(data.room).emit('receive code', {
//     code: data.code,
//     currentlyTyping: data.currentlyTyping,
//   });
// });
// socket.on('change mode', (data) => {
//   socket.broadcast.to(data.room).emit('receive change mode', data.mode);
// });

// socket.on('send users and code', (data) => {
//   socket.broadcast.to(data.room).emit('receive users and code', data);
// });
// });
