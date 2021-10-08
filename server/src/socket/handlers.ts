/* eslint-disable no-param-reassign */
import { Socket } from 'socket.io';
import SocketMessage from './socket-message';

interface CursorPosition {
  column: number;
  lineNumber: number;
}

interface CursorSelection {
  start: CursorPosition;
  end: CursorPosition;
}

interface EditorContent {
  index: number;
  text: string;
  length: number;
}

interface NodeState {
  // reserved keys, can customize initial value
  name: string;
  // 0 (unchecked, default) | 0.5 (half checked) | 1(checked),
  checked?: 0 | 0.5 | 1;
  isOpen?: boolean;
  children?: NodeState[];

  // internal keys (auto generated), plz don't include them in the initial data
  // path is an array of indexes to this node from root node
  path?: Array<unknown>;
  _id?: number;

  // will contain the full path to the file or folder
  filePath: string;

  // id of the file
  fileID: string;

  // if the node is the root folder
  isRoot: boolean;
}

enum FileTreeOperation {
  ADD = 'addNode',
  RENAME = 'renameNode',
  DELETE = 'deleteNode',
  INITIALIZATION = 'initialization',
}

interface TreeChangeEvent {
  type: FileTreeOperation;
  path: number[];
  params: Array<boolean | string>;
}

interface FileData {
  id: string;
  name: string;
}
export interface SocketData {
  roomJoiner: boolean;
  roomCreator: boolean;
  roomID: string;
  user: { id: string; name: string };
  cursorPosition: CursorPosition;
  cursorSelection: CursorSelection;
  content: EditorContent;
  focusedFile: FileData;
  newTree: NodeState;
  event: TreeChangeEvent;
}

export function createRoom(socket: Socket, data: SocketData): void {
  socket.join(data.roomID);
  socket.data = { ...socket.data, ...data, isHost: true };

  socket.to(data.roomID).emit(SocketMessage.CREATED_ROOM, {
    user: data.user,
    socketID: socket.id,
  });
}

export function joinRoom(socket: Socket, data: SocketData): void {
  socket.join(data.roomID);
  socket.data = { ...socket.data, ...data, isHost: false };

  socket.to(data.roomID).emit(SocketMessage.JOINED_ROOM, {
    user: data.user,
    socketID: socket.id,
  });
}

export function hostLeaveRoom(socket: Socket, { roomID }: SocketData): void {
  socket.to(roomID).emit(SocketMessage.HOST_LEAVE_ROOM);
  socket.leave(roomID);
}

export function userLeaveRoom(
  socket: Socket,
  { user, roomID }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.USER_LEAVE_ROOM, user);
  socket.leave(roomID);
}

export function cursorMoved(
  socket: Socket,
  { roomID, user, cursorPosition, focusedFile }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.CURSOR, {
    user,
    cursorPosition,
    focusedFile,
  });
}

export function selection(
  socket: Socket,
  { roomID, user, cursorSelection, focusedFile }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.SELECTION, {
    user,
    cursorSelection,
    focusedFile,
  });
}

export function insertContent(
  socket: Socket,
  { roomID, user, content, focusedFile }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.CONTENT_INSERT, {
    user,
    content,
    focusedFile,
  });
}

export function replaceContent(
  socket: Socket,
  { roomID, user, content, focusedFile }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.CONTENT_REPLACE, {
    user,
    content,
    focusedFile,
  });
}

export function deleteContent(
  socket: Socket,
  { roomID, user, content, focusedFile }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.CONTENT_DELETE, {
    user,
    content,
    focusedFile,
  });
}

export function updateFileTree(
  socket: Socket,
  { roomID, newTree, event }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.FILE_TREE_CHANGE, {
    newTree,
    event,
  });
}

export function disconnect(socket: Socket): void {
  if (socket.data.isHost) {
    hostLeaveRoom(socket, socket.data.roomID);
  } else {
    userLeaveRoom(socket, socket.data);
  }
}
