enum SocketMessage {
  CURSOR = 'cursor',
  SELECTION = 'selection',
  CONTENT = 'content',
  OPEN_FILE = 'open_file',
  NEW_FILE = 'new_file',
  RENAME_FILE = 'rename_file',
  DELETE_FILE = 'delete_file',
  MOVE_FILE = 'move_file',
  CREATE_ROOM = 'create_root',
  JOIN_ROOM = 'join_room',
  JOINED_ROOM = 'joined_room',
  HOST_LEAVE_ROOM = 'host_leave_room',
  USER_LEAVE_ROOM = 'user_leave_room',
  CONTENT_INSERT = 'content_insert',
  CONTENT_REPLACE = 'content_replace',
  CONTENT_DELETE = 'content_delete',
  CREATED_ROOM = 'created_room',
  FILE_TREE_CHANGE = 'file_tree_change',
}

export default SocketMessage;
