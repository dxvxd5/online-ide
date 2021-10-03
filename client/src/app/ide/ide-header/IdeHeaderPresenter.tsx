import React, { useEffect, useState } from 'react';
import Message from '../../../data/model/message';
import IdeModel from '../../../data/model/model';
import IdeHeaderView from './IdeHeaderView';

interface IdeHeaderPresenterProps {
  createRoom: () => void;
  joinRoom: (roomID: string) => void;
  leaveRoom: (roomID: string) => void;
  model: IdeModel;
}

export default function IdeHeaderPresenter({
  createRoom,
  joinRoom,
  leaveRoom,
  model,
}: IdeHeaderPresenterProps): JSX.Element {
  const [collaborators, setCollaborators] = useState(model.collaborators);
  const [roomID, setRoomID] = useState(model.roomID);
  const [isHost, setIsHost] = useState(model.isHost);

  useEffect(() => {
    function collabListener(m: Message) {
      if (m === Message.COLLAB_STARTED) {
        setRoomID(model.roomID);
        setIsHost(model.isHost);
      } else if (m === Message.COLLAB_STOPPED) {
        setRoomID(model.roomID);
        setIsHost(model.isHost);
        setCollaborators([...model.collaborators]);
      } else if (m === Message.USER_JOIN || m === Message.USER_LEFT)
        setCollaborators([...model.collaborators]);
    }
    model.addObserver(collabListener);
    return () => model.removeObserver(collabListener);
  }, []);

  const saveFileOnClick = () => {
    model.saveContentIntoFile();
  };

  return (
    <IdeHeaderView
      createRoom={createRoom}
      joinRoom={joinRoom}
      leaveRoom={leaveRoom}
      roomID={roomID}
      collaborators={collaborators}
      isCollab={!!roomID}
      isHost={isHost}
      saveFileOnClick={saveFileOnClick}
    />
  );
}
