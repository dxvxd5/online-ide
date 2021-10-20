import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import io from 'socket.io-client';
import Mousetrap from 'mousetrap';
import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Split from 'react-split';

import introJs from 'intro.js';
import 'intro.js/introjs.css';

import IdeModel, {
  SparseUserData as User,
  CursorPosition,
  CursorSelection,
  TreeChangeEvent,
  FileTreeOperation,
  FileData,
  FollowerData,
  ScrollPosition,
  StorageItem,
} from '../../data/model/model';
import Editor from '../editor/editor-tab-content/EditorTabContentManager';
import EditorTabs from '../editor/editor-tab-toggle/EditorTabTogglePresenter';
import SocketMessage from '../../utils/socket-message';
import IdeHeader from './ide-header/IdeHeaderPresenter';
import IdeSidebar from './sidebar/SidebarPresenter';
import { NodeState } from '../../utils/file-tree-node';
import Message from '../../data/model/message';

import '../../assets/styles/ide.css';

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

  const serverUrl = 'http://localhost:5000';

  function redirect(): void {
    history.push({
      pathname: '/me',
    });
  }

  function notifyUserLeft(message: string) {
    toast(message, {
      style: {
        background: '#333',
        color: '#fff',
      },
    });
  }

  function swalFireLeaveProject(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, leave!',
    });
  }

  async function tutorialPop() {
    const steps = ['1', '2', '3', '4', '5'];
    const swalQueue = Swal.mixin({
      progressSteps: steps,
      confirmButtonText: 'Next >',
      cancelButtonText: 'Skip',
      showCancelButton: true,
    });

    await swalQueue.fire({
      title: 'side bar',
      text: 'Create folders, files, rename and delete options in the side bar. Check the gif inspired from the folder tree package "react-folder-tree',
      imageUrl:
        'https://media.discordapp.net/attachments/898188780786315264/900474983015407726/Sidebar.gif?width=340&height=677',
      imageWidth: 200,
      imageHeight: 350,
      currentProgressStep: 0,
    });

    await swalQueue.fire({
      title: 'Slider',
      text: 'You can freely control the side bar by expanding and reducing it for a wider space for the editor space',
      imageUrl:
        'https://media.discordapp.net/attachments/898188780786315264/900474986848985128/Slider.gif',
      currentProgressStep: 1,
    });
    await swalQueue.fire({
      title: 'Start Collaboration',
      text: 'To start collaboration click on the "Start new Collaboration" button and a new button with the room ID will appear, where you can copy the room ID',
      imageUrl:
        'https://media.discordapp.net/attachments/898188780786315264/900474985318088754/Start_Collaboration.gif',
      currentProgressStep: 2,
    });
    await swalQueue.fire({
      title: 'Remove Collaborator',
      text: 'Remove a collaborator by go on the profile picture and click on the X button which appears when you hover on it. OBS! Only the host will be able to remove a collaborator',
      imageUrl:
        'https://media.discordapp.net/attachments/898188780786315264/900474979974529034/Remove_Collaborator.gif',
      currentProgressStep: 3,
    });
    await swalQueue.fire({
      title: 'Stop Collaboration',
      text: 'Stop the collaboration by clickling on the button "stop collaboration"',
      imageUrl:
        'https://media.discordapp.net/attachments/898188780786315264/900474987608170526/Stop_Collaboration.gif',
      currentProgressStep: 4,
      confirmButtonText: 'OK',
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
    IdeModel.saveToSessionStorage(
      StorageItem.SCK,
      `${isHost ? SocketState.HOST : SocketState.JOIN}`
    );
    setSocketState(socketstate);
  }

  const emitFocusedFile = (
    focusedFile: FileData | null,
    socketMessage: string,
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

  const resetCollab = (state: SocketState) => {
    if (state === SocketState.JOIN) {
      model.stopCollaboration();
      redirect();
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

  useEffect(function () {
    const locationListener = function () {
      const rm = IdeModel.getFromSessionStorage(StorageItem.ROOM);
      const sck = IdeModel.getFromSessionStorage(StorageItem.SCK);

      if (rm && window.location.hash === '#/me') {
        emitLeaveRoom(rm as string, sck as SocketState);
        resetCollab(sck as SocketState);
      }
    };
    window.addEventListener('popstate', locationListener);

    return function () {
      window.removeEventListener('popstate', locationListener);
    };
  }, []);

  useEffect(() => {
    if (!model.isLoggedIn) history.push({ pathname: '/login' });

    const ideListener = (m: Message) => {
      if (m === Message.FOCUSED_FILE) {
        emitFocusedFile(
          model.focusedFile,
          SocketMessage.FOLLOW_FILE,
          model.leader
        );
      }
      if (m === Message.TAB_FILE_CLOSE) {
        emitFocusedFile(
          model.focusedFile,
          SocketMessage.CLOSE_TAB_FILE,
          model.leader
        );
      }
    };
    model.addObserver(ideListener);
    if (model.persisted && !model.isHost) {
      history.push({ pathname: '/me' });
      Swal.fire(
        "You've been disconnected from the collaboration session. Please join again."
      );
    }
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

    Mousetrap.bind(['command+s', 'ctrl+s'], function () {
      model.saveContentIntoFile();
      return false;
    });

    socketRef.current.on(
      SocketMessage.JOINED_ROOM,
      ({ user, socketID }: { user: User; socketID: string }) => {
        if (socketID) {
          const message = `User ${user.name} joined the room.`;
          notifyUserLeft(message);
          socketRef.current?.emit(SocketMessage.JOINED_ROOM, {
            to: socketID,
            user: { id: model.userID, name: model.name },
          });
        }
        model.addCollaborator(user);
      }
    );

    socketRef.current.on(SocketMessage.USER_LEAVE_ROOM, (leaver: User) => {
      const message = `User ${leaver.name} left the room.`;
      notifyUserLeft(message);
      model.removeCollaborator(leaver);
    });

    socketRef.current.on(SocketMessage.HOST_LEAVE_ROOM, (host: User) => {
      if (!model.isHost) {
        const message = `Host ${host.name} left the room.`;
        notifyUserLeft(message);
      }
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
          model.setIsLeader(true);
          model.addFollower(follower);
          emitFocusedFile(model.focusedFile, SocketMessage.FOLLOW_FILE, leader);
        }
      }
    );

    socketRef.current.on(
      SocketMessage.FOLLOW_FILE,
      ({ focusedFile }: SocketData) => {
        model.setIsLeader(false);
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
        message = `You've been disconnected by the host`;
        model.stopCollaboration();
        setSocketState(SocketState.DISABLED);
        redirect();
      } else {
        message = `User ${leaver.name} has been disconnected by the host.`;
        model.removeCollaborator(leaver);
      }
      notifyUserLeft(message);
    });
  }, [socketState]);

  const socketCreateRoom = () => {
    toast
      .promise(model.createCollab(), {
        success: 'Room created',
        loading: 'creating room...',
        error: 'Failed to create room. Please try again',
      })
      .then((roomID) =>
        initiateSocket(roomID, SocketMessage.CREATE_ROOM, SocketState.HOST)
      );
  };

  const socketLeaveRoom = (roomId: string): void => {
    if (!socketRef.current) return;

    const message = `${
      socketState === SocketState.HOST ? 'All collaborators' : 'You'
    } will be disconnected`;

    swalFireLeaveProject(
      'Are you sure you want to leave the room?',
      message
    ).then((result) => {
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
    const isCollab = !!model.roomID;
    const title = 'Are you sure you want to leave this project?';
    if (!isCollab) {
      swalFireLeaveProject(title, '').then((result) => {
        if (result.isConfirmed) {
          model.closeProject();
          redirect();
        }
      });
    }
    if (isCollab) {
      swalFireLeaveProject(
        title,
        'All collaborators will be disconnected!'
      ).then((result) => {
        if (result.isConfirmed) {
          emitLeaveRoom(model.roomID, SocketState.HOST);
          resetCollab(SocketState.HOST);
          redirect();
        }
      });
    }
  };
  const tutorial = () => {
    const isHost = SocketState.HOST;
    if (!isHost) {
      tutorialPop();
    }
  };

  const removeCollaborator = ({ id, name }) => {
    swalFireLeaveProject(
      'Are you sure you want to remove this collaborator?',
      'This collaborator will be disconnected!'
    ).then((result) => {
      if (result.isConfirmed) {
        if (!socketRef.current) return;
        socketRef.current.emit(SocketMessage.REMOVE_COLLABORATOR, {
          roomID: model.roomID,
          user: { id, name },
        });
        model.removeCollaborator({ id, name });
      }
    });
  };

  const logout = () => {
    if (model.roomID) {
      const title = 'Are you sure?';
      const message = 'Your collaboration session will be ended';
      swalFireLeaveProject(title, message).then((res) => {
        if (res.isConfirmed) {
          emitLeaveRoom(model.roomID, socketState);
          resetCollab(socketState);
          model.logout();
          history.push({
            pathname: '/login',
          });
        }
      });
    } else {
      model.logout();
      history.push({
        pathname: '/login',
      });
    }
  };

  const tourIntroJS = () => {
    const intro = introJs;

    intro.setOptions({
      steps: [
        {
          intro: 'Welcome!',
        },
        {
          element: '#step-one',
          intro: 'First step',
        },
      ],
    });
    return intro.start();
  };

  return (
    <div className="container ide__container">
      {tourIntroJS}
      <IdeHeader
        removeCollaborator={removeCollaborator}
        leaveProject={leaveProject}
        tutorial={tutorial}
        startFollowOnClick={startFollowOnClick}
        leaveRoom={socketLeaveRoom}
        createRoom={socketCreateRoom}
        model={model}
        logout={logout}
      />
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
    </div>
  );
}
