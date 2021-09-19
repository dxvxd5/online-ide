/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Codemirror } from 'react-codemirror-ts';
import io from 'socket.io-client';
import axios from 'axios';
import EnterUsername from './components/EnterUsername';
import ConnectedUsers from './components/connectedUsers/ConnectedUsers';
import Messages from './components/messages/Messages';
import CodeEditor from './components/CodeEditor';

const Home = () => {
  const [value, setValue] = useState<string>('');
  const [clickedButton, setClickedButton] = useState(false);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [userID, setUserID] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(
    [] as { id: string; username: string }[]
  );
  const [messages, setMessages] = useState(
    [] as { message: string; username: string }[]
  );
  // Where we're going to type and send message:
  const [message, setMessage] = useState('');

  const socketClient = useRef<SocketIOClient.Socket>();

  // Gets updated as soon I type something inside the form element or the Codemirror element
  useEffect(() => {
    socketClient.current = io.connect('http://localhost:5000');

    if (socketClient.current) {
      socketClient.current.on('username-submitted-successfully', () => {
        setConnected(true);
      });

      socketClient.current.on('username-taken', () => {
        toast.error('Username is taken');
      });

      socketClient.current.on(
        'get-connected-users',
        (connectedUserss: { id: string; username: string }[]) => {
          setConnectedUsers(
            connectedUserss
            // connectedUserss.filter((user) => user.username === username) // '===' indicates CurrentUser (i.e. yourself)
          );
          connectedUsers.map((user) => {
            setUserID(user.id);
            return null;
          });
        }
      );

      socketClient.current.on(
        'receive-message',
        (messagee: { message: string; username: string }) => {
          setMessages((prev) => [...prev, messagee]);
        }
      );
    }

    return () => {
      socketClient.current?.disconnect();
      socketClient.current = undefined;
    };
  }, [username]);

  const handleConnection = () => {
    if (socketClient.current) {
      socketClient.current.emit('handle-connection', username);
      setCurrentUser(username);
    }
  };

  const handleSendMessage = () => {
    if (socketClient.current) {
      setMessages((prev) => [...prev, { message, username }]);
      socketClient.current.emit('message', { message, username });
      setMessage('');
    }
  };

  const goToCodeEditor = () => {
    if (clickedButton !== true) {
      setClickedButton(true);
    }
  };

  return (
    <div>
      <div className="container">
        {!connected && (
          <EnterUsername
            username={username}
            setUsername={setUsername}
            handleConnection={handleConnection}
          />
        )}
        {connected && !clickedButton && (
          <>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                goToCodeEditor();
              }}
            >
              Go to Code Editor
            </button>
            <ConnectedUsers connectedUsers={connectedUsers} />
            <Messages
              message={message}
              setMessage={setMessage}
              messages={messages}
              username={username}
              handleSendMessage={handleSendMessage}
            />
          </>
        )}
        {clickedButton && (
          <CodeEditor
            connectedUsers={connectedUsers}
            currentUser={currentUser}
            socketClient={socketClient}
          />
        )}

        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default Home;
