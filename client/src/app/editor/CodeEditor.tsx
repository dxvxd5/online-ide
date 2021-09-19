/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from 'react';
import { Codemirror } from 'react-codemirror-ts';
import MonacoEditor from 'react-monaco-editor';
import io from 'socket.io-client';
// import AceEditor from 'react-ace';

/* import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github'; */

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/bespin.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/isotope.css';
import 'codemirror/theme/duotone-light.css';
import 'codemirror/theme/icecoder.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/theme/solarized.css';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/clojure/clojure';
import 'codemirror/mode/python/python';
import 'codemirror/mode/php/php';
import 'codemirror/mode/erlang/erlang';
import 'codemirror/mode/coffeescript/coffeescript';
import 'codemirror/mode/crystal/crystal';
import User from '../components/connectedUsers/User';

const useConstructor: any = (callBack = () => {}) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
};

const CodeEditor = (props: {
  connectedUsers: { id: string; username: string }[];
  currentUser: string;
  socketClient: React.MutableRefObject<SocketIOClient.Socket | undefined>;
}) => {
  const [counter, setCounter] = useState(0);

  const [code, setCode] = useState('');
  const [mode, setMode] = useState('javascript');
  const [theme, setTheme] = useState('eclipse');
  const [users, setUsers] = useState([] as any);
  const [currentlyTyping, setCurrentlyTyping] = useState('');

  const codeEditorTokens = ['mmmm1111', 'aaaa4444', 'cccc2222', 'vvvv7777'];
  const options = {
    lineNumbers: true,
    mode,
    theme,
  };

  const removeUser = (user: string) => {
    const newUsers = Object.assign([], users);
    const indexOfUserToDelete = users.findIndex((OldUser: string) => {
      return OldUser === user;
    });
    newUsers.splice(indexOfUserToDelete, 1);
    setUsers(newUsers);
  };

  const joinUser = (user: {
    connectedUsers: { id: string; username: string }[];
    currentUser: string;
  }) => {
    const combinedUsers = [...users, user];
    const newUsers = Array.from(new Set(combinedUsers));
    const cleanUsers = newUsers.filter((userss) => {
      return userss.length > 1;
    });
    setUsers(cleanUsers);
  };

  const updateCodeInState = (payload: {
    code: string;
    currentlyTyping: string;
  }) => {
    setCode(payload.code);
    setCurrentlyTyping(payload.currentlyTyping);
  };

  const sendUsersAndCode = () => {
    if (props.socketClient.current) {
      props.socketClient.current.emit('send users and code', {
        room: codeEditorTokens[0],
        users,
        code,
      });
    }
  };

  const updateUsersAndCodeInState = (payload: {
    room: string;
    users: {
      connectedUsers: { id: string; username: string }[];
      currentUser: string;
    }[];
    code: string;
  }) => {
    const combinedUsers = users.concat(payload.users);
    const newUsers = Array.from(new Set(combinedUsers));
    const cleanUsers = newUsers.filter((userr: any) => {
      return userr.length > 1;
    });
    setUsers(cleanUsers);
    setCode(payload.code);
  };

  const updateCodeForCurrentUser = (newCode: string) => {
    setCode(newCode);
  };

  const updateCurrentlyTyping = () => {
    setCurrentlyTyping(props.currentUser);
  };

  const updateModeInState = (newMode: string) => {
    setMode(newMode);
  };

  const codeIsHappening = (newCode: string) => {
    if (props.socketClient.current) {
      updateCodeForCurrentUser(newCode);
      updateCurrentlyTyping();
      props.socketClient.current.emit('coding event', {
        code: newCode,
        room: codeEditorTokens[0],
        currentlyTyping: props.currentUser,
      });
    }
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
    if (props.socketClient.current) {
      props.socketClient.current.emit('coding event', {
        code: '',
        room: codeEditorTokens[0],
      });
    }
  };

  useConstructor(() => {
    if (props.socketClient.current) {
      props.socketClient.current.on(
        'receive code',
        (payload: { code: string; currentlyTyping: string }) =>
          updateCodeInState(payload)
      );
      props.socketClient.current.on('receive change mode', (newMode: string) =>
        updateModeInState(newMode)
      );
      props.socketClient.current.on(
        'new user join',
        (userss: {
          connectedUsers: { id: string; username: string }[];
          currentUser: string;
        }) => joinUser(userss)
      );
      props.socketClient.current.on('load users and code', () =>
        sendUsersAndCode()
      );
      props.socketClient.current.on(
        'receive users and code',
        (payload: {
          room: string;
          users: {
            connectedUsers: { id: string; username: string }[];
            currentUser: string;
          }[];
          code: string;
        }) => updateUsersAndCodeInState(payload)
      );
      props.socketClient.current.on('user left room', (user: string) =>
        removeUser(user)
      );
    }

    console.log(
      'This only happens ONCE and it happens BEFORE the initial render.'
    );
  });

  useMemo(() => {
    // componentWillReceiveProps()
    const user = props.currentUser;
    const nextUsers = [...users, user];
    if (props.socketClient.current) {
      props.socketClient.current.emit('room', {
        room: codeEditorTokens[1],
        user,
      });
      setUsers(nextUsers);
    }
  }, [props.currentUser]);

  // Gets updated as soon I type something inside the form element or the Codemirror element
  useEffect(() => {
    const propsUser = props.currentUser;
    sessionStorage.setItem('currentUser', propsUser);
    const usersArr = [...props.connectedUsers, props.currentUser];
    if (props.socketClient.current) {
      props.socketClient.current.emit('room', {
        room: codeEditorTokens[0],
        user: props.currentUser,
      });
    }
    setUsers(usersArr);
    // const user = connectedUserss.filter((user) => user.username === username);

    return () => {
      if (props.socketClient.current) {
        props.socketClient.current.emit('leave room', {
          room: codeEditorTokens[0],
          user: props.currentUser,
        });
      }
    };
  }, [props.currentUser]);

  return (
    <>
      <h1>Room token: {codeEditorTokens[0]}</h1>
      <h2>Users in the room:</h2>
      <ul>
        {props.connectedUsers.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </ul>
      {/*       <ModeSelect mode={mode} changeMode={changeMode} />
      <ThemeSelect theme={theme} changeTheme={changeTheme} />
 */}
      {/* <Codemirror value={code} onChange={codeIsHappening} options={options} /> */}
      <MonacoEditor
        width="800"
        height="600"
        className="monacoEditor"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={{
          tabSize: 2,
          selectOnLineNumbers: true,
        }}
        onChange={codeIsHappening}
      />
      {/*       <AceEditor
        mode="javascript"
        theme="github"
        onChange={codeIsHappening}
        name="example"
        value={code}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
 */}{' '}
      {/*       <Codemirror
        value={code}
        name="example"
        options={{
          lineNumbers: true,
          lineWrapping: true,
          matchBrackets: true,
          mode: 'javascript',
          tabSize: 2,
        }}
        onChange={codeIsHappening}
      />
 */}
      {/*       <br />
      <SaveButton
        text={this.state.code}
        lang={this.state.mode}
        title={this.props.challenge.title}
      />
      <br />
 */}
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          clearCode();
        }}
        className="col-lg-12"
      >
        clear code
      </button>
    </>
  );
};

export default CodeEditor;
