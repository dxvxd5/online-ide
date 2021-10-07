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
export interface SocketData {
  roomJoiner: boolean;
  roomCreator: boolean;
  roomID: string;
  user: { id: string; name: string };
  cursorPosition: CursorPosition;
  cursorSelection: CursorSelection;
  content: EditorContent;
}

export function createRoom(socket: Socket, data: SocketData): void {
  socket.join(data.roomID);
  socket.to(data.roomID).emit(SocketMessage.CREATED_ROOM, {
    user: data.user,
    socketID: socket.id,
  });
}

export function joinRoom(socket: Socket, data: SocketData): void {
  socket.join(data.roomID);
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
  { roomID, user, cursorPosition }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.CURSOR, {
    user,
    cursorPosition,
  });
}

export function selection(
  socket: Socket,
  { roomID, user, cursorSelection }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.SELECTION, {
    user,
    cursorSelection,
  });
}

export function insertContent(
  socket: Socket,
  { roomID, user, content }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.CONTENT_INSERT, {
    user,
    content,
  });
}

export function replaceContent(
  socket: Socket,
  { roomID, user, content }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.CONTENT_REPLACE, {
    user,
    content,
  });
}

export function deleteContent(
  socket: Socket,
  { roomID, user, content }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.CONTENT_DELETE, {
    user,
    content,
  });
}

export function updateFileTree(
  socket: Socket,
  {
    roomID,
    newTree,
    event,
  }: { roomID: string; newTree: NodeState; event: TreeChangeEvent }
): void {
  socket.to(roomID).emit(SocketMessage.FILE_TREE_CHANGE, {
    newTree,
    event,
  });
}
