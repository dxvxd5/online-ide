import toast from 'react-hot-toast';
import io from 'socket.io-client';
import Mousetrap from 'mousetrap';
import React, { useRef, useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import IdeModel, {
  SparseUserData as User,
  CursorPosition,
  CursorSelection,
  TreeChangeEvent,
  FileTreeOperation,
  FileData,
  FollowerData,
  ScrollPosition,
} from '../../data/model/model';
import Editor from '../editor/editor-tab-content/EditorTabContentManager';
import EditorTabs from '../editor/editor-tab-toggle/EditorTabTogglePresenter';
import SocketMessage from '../../utils/socket-message';
import IdeHeader from './ide-header/IdeHeaderPresenter';
import IdeSidebar from '../sidebar/SidebarPresenter';
import { NodeState } from '../../utils/file-tree-node';
import Message from '../../data/model/message';

interface IdePresenterProps {
  model: IdeModel;
}

enum SocketState {
  HOST,
  JOIN,
  DISABLED,
}

interface EditorContent {
  index: number;
  text: string;
  length: number;
}

interface SocketData {
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
  leaderID: string;
  socketID: string;
  leader: User;
  follower: FollowerData;
  scroll: ScrollPosition;
}

export default function IdePresenter({
  model,
}: IdePresenterProps): JSX.Element {
  const socketRef = useRef<SocketIOClient.Socket>();

  const [socketState, setSocketState] = useState(SocketState.DISABLED);

  const history = useHistory();

  const serverUrl = 'https://onlineide-server.herokuapp.com/';

  function redirect(): void {
    history.push({
      pathname: '/me',
    });
  }

  function intiateSocket(
    roomId: string,
    message: SocketMessage,
    socketstate: SocketState
  ): void {
    socketRef.current = io.connect(serverUrl);
    socketRef.current.emit(message, {
      roomID: roomId,
      user: { name: model.name, id: model.userID },
    });
    const isHost = socketstate === SocketState.HOST;
    model.startCollaboration(roomId, isHost);
    setSocketState(socketstate);
  }

  const emitFocusedFile = (focusedFile: FileData | null) => {
    if (!socketRef.current) return;
    if (!focusedFile) return;
    model.followers.forEach((follower) => {
      socketRef.current?.emit(SocketMessage.FOLLOW_FILE, {
        focusedFile,
        follower,
      });
    });
  };

  useEffect(() => {
    const currentFocusedFileListener = (m: Message) => {
      if (m === Message.FOCUSED_FILE) {
        emitFocusedFile(model.focusedFile);
      }
    };
    model.addObserver(currentFocusedFileListener);

    if (!model.isHost) {
      // When user join roon we initiate the socket
      intiateSocket(model.roomID, SocketMessage.JOIN_ROOM, SocketState.JOIN);
    }

    return () => model.removeObserver(currentFocusedFileListener);
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    if (socketState === SocketState.DISABLED) return;

    Mousetrap.bind(['command+s', 'ctrl+s'], function () {
      model.saveContentIntoFile();
      return false;
    });
    socketRef.current.on(
      SocketMessage.JOINED_ROOM,
      ({ user, socketID }: { user: User; socketID: string }) => {
        if (socketID) {
          socketRef.current?.emit(SocketMessage.JOINED_ROOM, {
            to: socketID,
            user: { id: model.userID, name: model.name },
          });
        }
        model.addCollaborator(user);
      }
    );

    socketRef.current.on(SocketMessage.USER_LEAVE_ROOM, (leaver: User) => {
      model.removeCollaborator(leaver);
    });

    socketRef.current.on(SocketMessage.HOST_LEAVE_ROOM, () => {
      model.stopCollaboration();
      redirect();
    });

    socketRef.current.on(
      SocketMessage.CURSOR,
      ({ user, cursorPosition, focusedFile }: SocketData) => {
        if (focusedFile.id === model.focusedFile?.id)
          model.moveCollabCursorPosition(cursorPosition, user.id);
      }
    );

    socketRef.current.on(
      SocketMessage.SCROLL_CHANGE,
      ({ focusedFile, scroll }: SocketData) => {
        if (focusedFile.id === model.focusedFile?.id) {
          model.moveCollabScrollPosition(scroll);
        }
      }
    );

    socketRef.current.on(
      SocketMessage.SELECTION,
      ({ user, cursorSelection, focusedFile }: SocketData) => {
        if (focusedFile.id === model.focusedFile?.id)
          model.moveCollabSelection(cursorSelection, user.id);
      }
    );

    socketRef.current.on(
      SocketMessage.CONTENT_INSERT,
      ({ content, focusedFile }: SocketData) => {
        if (focusedFile.id === model.focusedFile?.id)
          model.setCollabContentInsertion(content.index, content.text);
      }
    );

    socketRef.current.on(
      SocketMessage.CONTENT_REPLACE,
      ({ content, focusedFile }: SocketData) => {
        if (focusedFile.id === model.focusedFile?.id)
          model.setCollabContentReplacement(
            content.index,
            content.length,
            content.text
          );
      }
    );

    socketRef.current.on(
      SocketMessage.CONTENT_DELETE,
      ({ content, focusedFile }: SocketData) => {
        if (focusedFile.id === model.focusedFile?.id)
          model.setCollabContentDeletion(content.index, content.length);
      }
    );

    socketRef.current.on(
      SocketMessage.FILE_TREE_CHANGE,
      ({ newTree, event }: SocketData) => {
        model.setNewTree(newTree);
        model.updateTabs(newTree, event);
      }
    );

    socketRef.current.on(
      SocketMessage.START_FOLLOWING,
      ({ leader, follower }: SocketData) => {
        if (leader.id === model.userID) {
          model.addFollower(follower);
          emitFocusedFile(model.focusedFile);
        }
      }
    );

    socketRef.current.on(
      SocketMessage.FOLLOW_FILE,
      ({ focusedFile }: SocketData) => {
        model.addTabFile(focusedFile);
        model.setFocusedFile(focusedFile);
      }
    );

    socketRef.current.on(
      SocketMessage.STOP_FOLLOWING,
      ({ follower }: SocketData) => {
        model.removeFollower(follower);
      }
    );
  }, [socketState]);

  const socketCreateRoom = () => {
    toast
      .promise(model.createCollab(), {
        success: 'Room created',
        loading: 'creating room...',
        error: 'Failed to create room. Please try again',
      })
      .then((roomID) =>
        intiateSocket(roomID, SocketMessage.CREATE_ROOM, SocketState.HOST)
      );
  };

  const socketLeaveRoom = (roomId: string): void => {
    if (!socketRef.current) return;

    const message =
      socketState === SocketState.HOST
        ? SocketMessage.HOST_LEAVE_ROOM
        : SocketMessage.USER_LEAVE_ROOM;

    socketRef.current.emit(message, {
      roomID: roomId,
      user: { name: model.name, id: model.userID },
    });

    if (socketState === SocketState.JOIN) {
      model.stopCollaboration();
      setSocketState(SocketState.DISABLED);
      redirect();
    }

    if (socketState === SocketState.HOST) {
      model.stopCollaboration();
      model.notifyHostLeft();
      setSocketState(SocketState.DISABLED);
    }
  };

  const onEditorCursorMoved = (position: CursorPosition) => {
    if (!socketRef.current) return;
    socketRef.current.emit(SocketMessage.CURSOR, {
      user: { name: model.name, id: model.userID },
      cursorPosition: position,
      roomID: model.roomID,
      focusedFile: model.focusedFile,
    });
  };

  const onEditorSelection = (start: CursorPosition, end: CursorPosition) => {
    if (!socketRef.current) return;

    socketRef.current.emit(SocketMessage.SELECTION, {
      user: { name: model.name, id: model.userID },
      cursorSelection: { start, end },
      roomID: model.roomID,
      focusedFile: model.focusedFile,
    });
  };

  const onContentInsert = (index: number, text: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit(SocketMessage.CONTENT_INSERT, {
      user: { name: model.name, id: model.userID },
      content: { index, text },
      roomID: model.roomID,
      focusedFile: model.focusedFile,
    });
  };

  const onContentReplace = (index: number, length: number, text: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit(SocketMessage.CONTENT_REPLACE, {
      user: { name: model.name, id: model.userID },
      content: { index, length, text },
      roomID: model.roomID,
      focusedFile: model.focusedFile,
    });
  };

  const onContentDelete = (index: number, length: number) => {
    if (!socketRef.current) return;

    socketRef.current.emit(SocketMessage.CONTENT_DELETE, {
      user: { name: model.name, id: model.userID },
      content: { index, length },
      roomID: model.roomID,
      focusedFile: model.focusedFile,
    });
  };

  const onFileTreeChange = (t: NodeState, e: TreeChangeEvent) => {
    if (
      [
        FileTreeOperation.INITIALIZATION,
        FileTreeOperation.TOGGLE_OPEN,
        FileTreeOperation.CHECK,
      ].includes(e.type)
    )
      return;
    model.applyFileTreeChange(t, e).then(() => {
      if (!socketRef.current) return;
      socketRef.current.emit(SocketMessage.FILE_TREE_CHANGE, {
        newTree: t,
        event: e,
        roomID: model.roomID,
      });
      e.type = FileTreeOperation.INITIALIZATION;
    });
  };

  const stopFollowing = () => {
    if (!model.leader) return;
    if (!socketRef.current) return;

    socketRef.current.emit(SocketMessage.STOP_FOLLOWING, {
      roomID: model.roomID,
    });
    model.setLeader(null);
  };

  const startFollowOnClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const leader: User = JSON.parse(event.target.value);
    if (!socketRef.current) return;
    if (!leader || leader.id === model.leader?.id) return;
    stopFollowing();
    model.setLeader(leader);
    socketRef.current.emit(SocketMessage.START_FOLLOWING, {
      leader,
      roomID: model.roomID,
    });
  };

  const onScrollChange = (scrollLeft: number, scrollTop: number) => {
    if (!socketRef.current) return;
    model.followers.forEach((follower) => {
      socketRef.current?.emit(SocketMessage.SCROLL_CHANGE, {
        follower,
        focusedFile: model.focusedFile,
        scroll: { scrollLeft, scrollTop },
      });
    });
  };

  return (
    <>
      <IdeHeader
        stopFollowing={stopFollowing}
        startFollowOnClick={startFollowOnClick}
        leaveRoom={socketLeaveRoom}
        createRoom={socketCreateRoom}
        model={model}
      />
      <IdeSidebar
        stopFollowing={stopFollowing}
        onFileTreeChange={onFileTreeChange}
        model={model}
      />
      <EditorTabs stopFollowing={stopFollowing} model={model} />
      <Editor
        model={model}
        onScrollChange={onScrollChange}
        onEditorCursorMoved={onEditorCursorMoved}
        onEditorSelection={onEditorSelection}
        onContentInsert={onContentInsert}
        onContentReplace={onContentReplace}
        onContentDelete={onContentDelete}
      />
    </>
  );
}
