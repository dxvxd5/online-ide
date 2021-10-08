import React, { useEffect, useState } from 'react';
import Message from '../../../data/model/message';
import IdeModel from '../../../data/model/model';
import IdeHeaderView from './IdeHeaderView';

interface IdeHeaderPresenterProps {
  createRoom: () => void;
  leaveRoom: (roomID: string) => void;
  model: IdeModel;
  startFollowOnClick: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  stopFollowing: () => void;
}

export default function IdeHeaderPresenter({
  createRoom,
  leaveRoom,
  model,
  startFollowOnClick,
  stopFollowing,
}: IdeHeaderPresenterProps): JSX.Element {
  const [collaborators, setCollaborators] = useState(model.collaborators);
  const [roomID, setRoomID] = useState(model.roomID);

  useEffect(() => {
    function collabListener(m: Message) {
      if (m === Message.COLLAB_STARTED) {
        setRoomID(model.roomID);
      } else if (m === Message.COLLAB_STOPPED) {
        setRoomID(model.roomID);
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
      stopFollowing={stopFollowing}
      model={model}
      startFollowOnClick={startFollowOnClick}
      createRoom={createRoom}
      leaveRoom={leaveRoom}
      roomID={roomID}
      collaborators={collaborators}
      isCollab={!!roomID}
      saveFileOnClick={saveFileOnClick}
    />
  );
}
