import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import IdeModel from '../../data/model/model';
import HomeView from './HomeView';

interface HomePresenterProps {
  model: IdeModel;
}

export default function HomePresenter({
  model,
}: HomePresenterProps): JSX.Element {
  const [value, setValue] = useState<string>('');
  const [clickedButton, setClickedButton] = useState(false);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [connectedUser, setConnectedUser] = useState(
    {} as { id: string; username: string }
  );
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
    connectedUser.username = username;
    if (socketClient.current) {
      console.log('connectedUser: ', connectedUser);
      socketClient.current.emit('handle-connection', connectedUser);
      setConnectedUser(connectedUser);
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
    <HomeView
      connected={connected}
      connectedUser={connectedUser}
      setUsername={setUsername}
      handleConnection={handleConnection}
      clickedButton={clickedButton}
      socketClient={socketClient}
      goToCodeEditor={goToCodeEditor}
      message={message}
      messages={messages}
      setMessage={setMessage}
      handleSendMessage={handleSendMessage}
      model={model}
      connectedUsers={connectedUsers}
    />
  );
}
