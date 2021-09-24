import React from 'react';
import { ToastContainer } from 'react-toastify';
import EnterUsername from '../components/EnterUsername';
import ConnectedUsers from '../components/connectedUsers/ConnectedUsers';
import Messages from '../components/messages/Messages';
import CodeEditorPresenter from '../editor/CodeEditorPresenter';
import IdeModel from '../../data/model/model';

interface HomeProp {
  model: IdeModel;
  connected: boolean;
  connectedUser: {
    id: string;
    username: string;
  };
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  handleConnection: () => void;
  clickedButton: boolean;
  goToCodeEditor: () => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  connectedUsers: {
    id: string;
    username: string;
  }[];
  messages: {
    message: string;
    username: string;
  }[];
  socketClient: React.MutableRefObject<SocketIOClient.Socket | undefined>;
}

const Home = ({
  model,
  connected,
  connectedUser,
  setUsername,
  handleConnection,
  clickedButton,
  goToCodeEditor,
  message,
  messages,
  setMessage,
  handleSendMessage,
  connectedUsers,
  socketClient,
}: HomeProp) => {
  return (
    <div>
      <div className="container">
        {!connected && (
          <EnterUsername
            username={connectedUser.username}
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
              username={connectedUser.username}
              handleSendMessage={handleSendMessage}
            />
          </>
        )}
        {clickedButton && (
          <CodeEditorPresenter
            model={model}
            connectedUsers={connectedUsers}
            connectedUser={connectedUser}
            socketClient={socketClient}
          />
        )}

        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default Home;
