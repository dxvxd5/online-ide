/* import express from 'express';

const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  res.send('Well done!');
});
app.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}!`);
});*/

const express = require('express');
const app = express();
const path = require('path');
const PORT = 8000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//app.use(express.static(`${__dirname}/../build`));

io.sockets.on('connection', (socket: any) => {
  console.log('user connected');

  socket.on('join', (room: any) => {
    //room name is just the pathname, split and joined to remove forward slash
    let fixedRoom = room.split('/').join('');
    socket.join(room.split('/').join(''));
    io.in(fixedRoom).emit('room', fixedRoom);
  });

  socket.on('message', (message: any) => {
    io.in(message.room).emit('message', {
      room: message.room,
      value: message.newValue,
    });
  });

  // socket.on('toolbar', (settings) => {
  //     console.log('settngs', settings)
  //     io.in(settings.room).emit('toolbar', settings)
  // })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/', (_req: any, res: any) => {
  //res.sendFile(path.join(__dirname, '../build/index.html'));
  res.send('Well done!');
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}!`);
});
