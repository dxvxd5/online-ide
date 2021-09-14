import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = 8000;
const serverPORT = 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });

io.on('connection', (socket) => {
  console.log('Client connected');
});

server.listen(serverPORT, () =>
  console.log(`Server started on port ${serverPORT}!`)
);

/*app.get('/', (req, res) => {
  res.send('Well done!');
});
app.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}!`);
});*/
