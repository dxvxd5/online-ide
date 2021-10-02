import { Server } from 'socket.io';
import SocketMessage from './socket-message';
import * as SocketHandler from './handlers';

const socketFunction = (io: Server): void => {
  io.on('connection', (socket) => {
    socket.on(SocketMessage.CREATE_ROOM, (data) =>
      SocketHandler.createRoom(socket, data)
    );

    socket.on(SocketMessage.JOIN_ROOM, (data) =>
      SocketHandler.joinRoom(socket, data)
    );

    socket.on(SocketMessage.JOINED_ROOM, ({ to, user }) =>
      io.to(to).emit(SocketMessage.JOINED_ROOM, { user })
    );

    socket.on(SocketMessage.HOST_LEAVE_ROOM, (data) =>
      SocketHandler.hostLeaveRoom(socket, data)
    );

    socket.on(SocketMessage.USER_LEAVE_ROOM, (data) =>
      SocketHandler.userLeaveRoom(socket, data)
    );

    socket.on(SocketMessage.CURSOR, (data) =>
      SocketHandler.cursorMoved(socket, data)
    );

    socket.on(SocketMessage.SELECTION, (data) =>
      SocketHandler.selection(socket, data)
    );

    socket.on(SocketMessage.CONTENT_INSERT, (data) =>
      SocketHandler.insertContent(socket, data)
    );

    socket.on(SocketMessage.CONTENT_REPLACE, (data) =>
      SocketHandler.replaceContent(socket, data)
    );

    socket.on(SocketMessage.CONTENT_DELETE, (data) =>
      SocketHandler.deleteContent(socket, data)
    );
  });
};

export default socketFunction;
