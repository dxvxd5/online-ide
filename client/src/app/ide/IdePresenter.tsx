import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import io from 'socket.io-client';
import Mousetrap from 'mousetrap';
import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Split from 'react-split';

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
import IdeSidebar from './sidebar/SidebarPresenter';
import Error from '../components/error/Error';
import { NodeState } from '../../utils/file-tree-node';
import Message from '../../data/model/message';

import '../../assets/styles/ide.css';
import copyToClipboard from '../../utils/clipboard';
import toastPromise from '../../utils/toast';
import fireTutorials from '../../utils/tutorial';
import debounce from '../../utils/debounce';

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
  const [project, setProject] = useState(model.currentProject);

  const history = useHistory();

  const serverUrl = 'http://localhost:5000';

  function redirectTo(to: 'me' | 'login' | 'code') {
    history.push({
      pathname: `/${to}`,
    });
  }

  function notifyUserLeft(message: string) {
    toast(message, { icon: 'ℹ' });
  }

  function swalFireLeaveProject(text: string) {
    return Swal.fire({
      title: 'Are you sure?',
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      heightAuto: false,
    });
  }

  function initiateSocket(
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

  const emitToFollowers = (
    focusedFile: FileData | null,
    socketMessage: SocketMessage,
    leader: User
  ) => {
    if (!socketRef.current) return;
    if (!focusedFile) return;
    model.followers.forEach((follower) => {
      socketRef.current?.emit(socketMessage, {
        focusedFile,
        follower,
        leader,
      });
    });
  };

  const emitOpenFile = (focusedFile: FileData) => {
    socketRef.current?.emit(SocketMessage.OPEN_FILE, {
      focusedFile,
      user: { name: model.name, id: model.userID },
      roomID: model.roomID,
    });
  };

  const resetCollab = (state: SocketState) => {
    if (state === SocketState.JOIN) {
      model.closeProject();
      model.stopCollaboration();
      redirectTo('me');
      setSocketState(SocketState.DISABLED);
    } else if (state === SocketState.HOST) {
      model.stopCollaboration();
      model.notifyHostLeft();
      setSocketState(SocketState.DISABLED);
    }
  };

  const emitLeaveRoom = (roomId: string, state: SocketState) => {
    if (!socketRef.current) return;
    const message =
      state === SocketState.HOST
        ? SocketMessage.HOST_LEAVE_ROOM
        : SocketMessage.USER_LEAVE_ROOM;

    socketRef.current.emit(message, {
      roomID: roomId,
      user: { name: model.name, id: model.userID },
    });
  };

  const saveCurrentFile = () => {
    if (!model.focusedFile) {
      toast.error('No file opened');
      return;
    }
    const msgs = {
      loading: 'Saving file...',
      success: 'File saved',
      error: 'Could not save file',
    };
    const promise = model.saveContentIntoFile();
    toastPromise(promise, msgs);
  };

  useEffect(() => {
    const hashListener = () => {
      if (window.location.hash === '#/code') return;
      const state = model.isHost ? SocketState.HOST : SocketState.JOIN;
      emitLeaveRoom(model.roomID, state);
      resetCollab(state);
    };
    window.addEventListener('hashchange', hashListener);

    return () => window.removeEventListener('hashchange', hashListener);
  }, []);

  useEffect(() => {
    Mousetrap.bind(
      ['command+s', 'ctrl+s'],
      debounce(() => saveCurrentFile())
    );

    if (!model.isLoggedIn) redirectTo('login');
    else if (model.persisted && model.isInCollab) {
      let title;
      if (model.isHost) title = 'The collaboration session was ended';
      else {
        title =
          'You have been disconnected from the collaboration session. Please join again.';
        redirectTo('me');
      }
      Swal.fire({
        title,
        heightAuto: false,
      });
      model.setPersisted(false);
      model.stopCollaboration();
    }
  }, []);

  useEffect(() => {
    const ideListener = (m: Message) => {
      if (m === Message.FOCUSED_FILE) {
        emitToFollowers(
          model.focusedFile,
          SocketMessage.FOLLOW_FILE,
          model.leader
        );
        emitOpenFile(model.focusedFile);
      }

      if (m === Message.TAB_FILE_CLOSE) {
        emitToFollowers(
          model.focusedFile,
          SocketMessage.CLOSE_TAB_FILE,
          model.leader
        );
      }
    };
    model.addObserver(ideListener);

    if (!model.isHost) {
      // When user join room we initiate the socket
      initiateSocket(model.roomID, SocketMessage.JOIN_ROOM, SocketState.JOIN);
    }

    return () => {
      model.removeObserver(ideListener);
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    if (socketState === SocketState.DISABLED) return;

    socketRef.current.on(
      SocketMessage.JOINED_ROOM,
      ({ user, socketID, focusedFile }: SocketData) => {
        if (socketID) {
          const message = `${user.name} joined the session.`;
          notifyUserLeft(message);
          socketRef.current?.emit(SocketMessage.JOINED_ROOM, {
            to: socketID,
            user: { id: model.userID, name: model.name },
            focusedFile: model.focusedFile,
          });
        }
        model.addCollaborator(user, focusedFile);
      }
    );

    socketRef.current.on(SocketMessage.USER_LEAVE_ROOM, (leaver: User) => {
      const message = `${leaver.name} left the session.`;
      notifyUserLeft(message);
      model.removeCollaborator(leaver);
    });

    socketRef.current.on(SocketMessage.HOST_LEAVE_ROOM, () => {
      if (!model.isHost) {
        Swal.fire({ title: 'The host ended the session', icon: 'info' });
      }
      model.closeProject();
      model.stopCollaboration();
      redirectTo('me');
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
          model.setIsLeader(true);
          model.addFollower(follower);
          emitToFollowers(model.focusedFile, SocketMessage.FOLLOW_FILE, leader);
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
      SocketMessage.CLOSE_TAB_FILE,
      ({ focusedFile }: SocketData) => {
        model.closeTabFile(focusedFile);
      }
    );

    socketRef.current.on(
      SocketMessage.STOP_FOLLOWING,
      ({ follower }: SocketData) => {
        model.removeFollower(follower);
      }
    );

    socketRef.current.on(SocketMessage.REMOVE_COLLABORATOR, (leaver: User) => {
      if (!socketRef.current) return;
      let message;
      if (leaver.id === model.userID) {
        socketRef.current.emit(SocketMessage.LEAVE_SOCKET_ROOM, {
          roomID: model.roomID,
        });
        Swal.fire({
          title: 'You have been disconnected by the host',
          icon: 'info',
        });
        model.closeProject();
        model.stopCollaboration();
        setSocketState(SocketState.DISABLED);
        redirectTo('me');
      } else {
        message = `${leaver.name} has been disconnected by the host.`;
        notifyUserLeft(message);
        model.removeCollaborator(leaver);
      }
    });

    socketRef.current.on(
      SocketMessage.OPEN_FILE,
      ({ user, focusedFile }: SocketData) => {
        model.updateCollaboratorFocusedFile(user, focusedFile);
      }
    );
  }, [socketState]);

  const socketCreateRoom = () => {
    if (!project) {
      toast.error('No project to collaborate on');
      return;
    }

    const promise = model.createCollab().then((roomID) => {
      initiateSocket(roomID, SocketMessage.CREATE_ROOM, SocketState.HOST);
      copyToClipboard(roomID);
    });
    const msgs = {
      success: 'Session created and session ID copied to clipboard',
      loading: 'Creating session...',
      error: 'Failed to create session. Please try again',
    };
    toastPromise(promise, msgs);
  };

  const socketLeaveRoom = (roomId: string): void => {
    if (!socketRef.current) return;

    const message = `${
      socketState === SocketState.HOST ? 'All collaborators' : 'You'
    } will be disconnected`;

    swalFireLeaveProject(message).then((result) => {
      if (result.isConfirmed) {
        emitLeaveRoom(roomId, socketState);
        resetCollab(socketState);
      }
    });
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
    model
      .applyFileTreeChange(t, e)
      .then(() => {
        if (!socketRef.current) return;
        socketRef.current.emit(SocketMessage.FILE_TREE_CHANGE, {
          newTree: t,
          event: e,
          roomID: model.roomID,
        });

        e.type = FileTreeOperation.INITIALIZATION;
      })
      .catch();
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

    if (leader.id === 'unfollow') {
      stopFollowing();
      return;
    }

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

  const leaveProject = () => {
    if (model.roomID) {
      swalFireLeaveProject('All collaborators will be disconnected!').then(
        (result) => {
          if (result.isConfirmed) {
            emitLeaveRoom(model.roomID, SocketState.HOST);
            resetCollab(SocketState.HOST);
            redirectTo('me');
          }
        }
      );
    } else {
      model.closeProject();
      redirectTo('me');
    }
  };

  const removeCollaborator = ({ id, name }) => {
    swalFireLeaveProject('This collaborator will be disconnected!').then(
      (result) => {
        if (result.isConfirmed) {
          if (!socketRef.current) return;
          socketRef.current.emit(SocketMessage.REMOVE_COLLABORATOR, {
            roomID: model.roomID,
            user: { id, name },
          });
          model.removeCollaborator({ id, name });
        }
      }
    );
  };

  const logout = () => {
    if (model.roomID) {
      let message = 'The collaboration session will be ended. ';
      const secondMessage = 'All collaborators will be disconnected.';
      message = `${message}${model.isHost ? secondMessage : ''}`;

      swalFireLeaveProject(message).then((res) => {
        if (res.isConfirmed) {
          emitLeaveRoom(model.roomID, socketState);
          resetCollab(socketState);
          model.logout();
          redirectTo('login');
        }
      });
    } else {
      model.logout();
      redirectTo('login');
    }
  };

  return (
    <div className="container ide__container">
      <IdeHeader
        removeCollaborator={removeCollaborator}
        leaveProject={leaveProject}
        tutorial={fireTutorials}
        startFollowOnClick={startFollowOnClick}
        leaveRoom={socketLeaveRoom}
        createRoom={socketCreateRoom}
        model={model}
        logout={logout}
      />
      {!project ? (
        <Error
          errorInfo={
            'No project opened. \nPlease try again by opening a project from the main page'
          }
          tryAgain={() => redirectTo('me')}
          className="error--ide"
        />
      ) : (
        <Split
          sizes={[15, 85]}
          minSize={[150, 500]}
          expandToMin={false}
          gutterSize={10}
          className="split"
        >
          <IdeSidebar
            stopFollowing={stopFollowing}
            onFileTreeChange={onFileTreeChange}
            model={model}
          />

          <div className="container ide__container ide__container--level1">
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
          </div>
        </Split>
      )}
    </div>
  );
}
