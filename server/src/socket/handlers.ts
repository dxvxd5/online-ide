/* eslint-disable no-param-reassign */
import { Socket } from 'socket.io';
import { deleteCollab } from '../models/project.model';
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

interface LeaderData {
  name: string;
  id: string;
}

interface FollowerData {
  socketID: string;
  user: {
    id: string;
    name: string;
  };
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
  leader: LeaderData;
  to: string;
  follower: FollowerData;
  scroll: { scrollLeft: number; scrollTop: number };
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
  socket.to(roomID).emit(SocketMessage.HOST_LEAVE_ROOM, socket.data.user);
  socket.leave(roomID);
  deleteCollab(roomID);
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

export function startFollowing(
  socket: Socket,
  { roomID, leader }: SocketData
): void {
  socket.to(roomID).emit(SocketMessage.START_FOLLOWING, {
    leader,
    follower: { socketID: socket.id, user: socket.data.user },
  });
}

export function followFile(
  socket: Socket,
  { focusedFile, follower, leader }: SocketData
): void {
  socket.to(follower.socketID).emit(SocketMessage.FOLLOW_FILE, {
    focusedFile,
    leader,
  });
}

export function stopFollowing(socket: Socket, { roomID }: SocketData): void {
  socket.to(roomID).emit(SocketMessage.STOP_FOLLOWING, {
    follower: { socketID: socket.id, user: socket.data.user },
  });
}

export function scrollUpdate(
  socket: Socket,
  { follower, focusedFile, scroll }: SocketData
): void {
  socket.to(follower.socketID).emit(SocketMessage.SCROLL_CHANGE, {
    focusedFile,
    scroll,
  });
}

export function deleteTabFile(
  socket: Socket,
  { follower, focusedFile }: SocketData
): void {
  socket.to(follower.socketID).emit(SocketMessage.CLOSE_TAB_FILE, {
    focusedFile,
  });
}

export function disconnect(socket: Socket): void {
  if (socket.data.isHost) {
    hostLeaveRoom(socket, socket.data);
  } else {
    userLeaveRoom(socket, socket.data);
  }
}
