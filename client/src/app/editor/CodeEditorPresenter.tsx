import React, { useEffect, useMemo, useState } from 'react';
import IdeModel from '../../data/model/model';
import CodeEditorView from './CodeEditorView';

interface CodeEditorPresenterProp {
  model: IdeModel;
  connectedUsers: {
    id: string;
    username: string;
  }[];
  connectedUser: {
    id: string;
    username: string;
  };
  socketClient: React.MutableRefObject<SocketIOClient.Socket | undefined>;
}

const useConstructor = (callBack = () => {}) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
};

export default function CodeEditorPresenter({
  model,
  connectedUsers,
  connectedUser,
  socketClient,
}: CodeEditorPresenterProp): JSX.Element {
  const editorReference = React.createRef() as React.RefObject<any>;
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('javascript');
  const [theme, setTheme] = useState('eclipse');
  const [users, setUsers] = useState(
    [] as {
      id: string;
      username: string;
    }[]
  );
  const [currentlyTyping, setCurrentlyTyping] = useState(
    {} as {
      id: string;
      username: string;
    }
  );

  const codeEditorTokens = ['mmmm1111', 'aaaa4444', 'cccc2222', 'vvvv7777'];
  const options = {
    lineNumbers: true,
    mode,
    theme,
  };

  const removeUser = (user: { id: string; username: string }) => {
    const newUsers = Object.assign([], users);
    const indexOfUserToDelete = users.findIndex(
      (oldUser: { id: string; username: string }) => {
        return oldUser.username === user.username;
      }
    );
    newUsers.splice(indexOfUserToDelete, 1);
    setUsers(newUsers);
  };

  const updateCodeInState = (payload: {
    code: string;
    currentlyTyping: {
      id: string;
      username: string;
    };
  }) => {
    setCode(payload.code);
    setCurrentlyTyping(payload.currentlyTyping);
  };

  const sendUsersAndCode = () => {
    if (socketClient.current) {
      socketClient.current.emit('send users and code', {
        room: codeEditorTokens[0],
        users,
        code,
      });
    }
  };

  const updateUsersAndCodeInState = (payload: {
    room: string;
    users: {
      id: string;
      username: string;
    }[];
    code: string;
  }) => {
    const combinedUsers = users.concat(payload.users);
    const newUsers = Array.from(new Set(combinedUsers));
    const cleanUsers = newUsers.filter((userss: any) => {
      // Fix "any" type here
      console.log('userLength: ', userss.length);
      return userss.length > 1;
    });
    setUsers(cleanUsers);
    setCode(payload.code);
  };

  const updateCodeForCurrentUser = (newCode: string) => {
    setCode(newCode);
  };

  const updateCurrentlyTyping = () => {
    setCurrentlyTyping(connectedUser);
  };

  const updateModeInState = (newMode: string) => {
    setMode(newMode);
  };

  const codeIsHappening = (newCode: string) => {
    if (socketClient.current) {
      updateCodeForCurrentUser(newCode);
      updateCurrentlyTyping();
      socketClient.current.emit('coding event', {
        code: newCode,
        room: codeEditorTokens[0],
        currentlyTyping: connectedUser,
      });
    }
  };

  const joinUser = (
    userss: {
      id: string;
      username: string;
    }[]
  ) => {
    // const combinedUsers = [...users, user];
    const combinedUsers = users.concat(userss);
    const newUsers = Array.from(new Set(combinedUsers));
    const cleanUsers = newUsers.filter((usersss: any) => {
      // Fix "any" type here
      return usersss.length > 1;
    });
    setUsers(cleanUsers);
  };

  /*   const changeMode = (newMode: string) => {
    updateModeInState(newMode);
    if (props.socketClient.current) {
      props.socketClient.current.emit('change mode', {
        mode: newMode,
        room: codeEditorTokens[0],
      });
    }
  };

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };
 */
  const clearCode = () => {
    setCode('');
    if (socketClient.current) {
      socketClient.current.emit('coding event', {
        code: '',
        room: codeEditorTokens[0],
      });
    }
  };

  useConstructor(() => {
    if (socketClient.current) {
      socketClient.current.on(
        'receive code',
        (payload: {
          code: string;
          currentlyTyping: {
            id: string;
            username: string;
          };
        }) => updateCodeInState(payload)
      );
      socketClient.current.on('receive change mode', (newMode: string) =>
        updateModeInState(newMode)
      );
      socketClient.current.on(
        'new user join',
        (
          userss: {
            id: string;
            username: string;
          }[]
        ) => joinUser(userss)
      );
      socketClient.current.on('load users and code', () => sendUsersAndCode());
      socketClient.current.on(
        'receive users and code',
        (payload: {
          room: string;
          users: {
            id: string;
            username: string;
          }[];
          code: string;
        }) => updateUsersAndCodeInState(payload)
      );
      socketClient.current.on(
        'user left room',
        (user: { id: string; username: string }) => removeUser(user)
      );
    }

    console.log(
      'This only happens ONCE and it happens BEFORE the initial render.'
    );
  });

  useMemo(() => {
    // componentWillReceiveProps()
    const user = connectedUser;
    const nextUsers = [...users, user];
    if (socketClient.current) {
      socketClient.current.emit('room', {
        room: codeEditorTokens[1],
        user,
      });
      setUsers(nextUsers);
    }
  }, [connectedUser]);

  // Gets updated as soon I type something inside the form element or the Codemirror element
  useEffect(() => {
    const propsCurrentUser = connectedUser;
    sessionStorage.setItem('currentUser', propsCurrentUser.username);
    const usersArr = connectedUsers.concat(propsCurrentUser);
    const usersArr2 = [...connectedUsers, propsCurrentUser];
    console.log('propsCurrentUser: ', propsCurrentUser);
    console.log('connectedUsers: ', connectedUsers);
    console.log('usersArr: ', usersArr);
    console.log('usersArr2: ', usersArr2);
    if (socketClient.current) {
      socketClient.current.emit('room', {
        room: codeEditorTokens[0],
        user: connectedUser,
      });
    }
    setUsers(usersArr);
    // const user = connectedUserss.filter((user) => user.username === username);

    return () => {
      if (socketClient.current) {
        socketClient.current.emit('leave room', {
          room: codeEditorTokens[0],
          user: connectedUser,
        });
      }
    };
  }, [connectedUser]);

  const monacodidmount = (editor: { focus: () => any }) => {
    editor.focus();
  };

  return (
    <CodeEditorView
      connectedUsers={connectedUsers}
      connectedUser={connectedUser}
      socketClient={socketClient}
      codeEditorTokens={codeEditorTokens}
      code={code}
      codeIsHappening={codeIsHappening}
      monacodidmount={monacodidmount}
      editorReference={editorReference}
      clearCode={clearCode}
    />
  );
}
