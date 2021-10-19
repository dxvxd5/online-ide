import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { differenceWith } from 'lodash';
import Message from '../../../data/model/message';
import IdeModel, { Collaborator } from '../../../data/model/model';
import IdeHeaderView from './IdeHeaderView';

interface IdeHeaderPresenterProps {
  createRoom: () => void;
  leaveRoom: (roomID: string) => void;
  model: IdeModel;
  startFollowOnClick: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  leaveProject: () => void;
  tutorial: () => void;
  removeCollaborator: (collaborator: Collaborator) => void;
  logout: () => void;
}

export default function IdeHeaderPresenter({
  createRoom,
  leaveRoom,
  model,
  startFollowOnClick,
  leaveProject,
  tutorial,
  removeCollaborator,
  logout,
}: IdeHeaderPresenterProps): JSX.Element {
  const [collaborators, setCollaborators] = useState(model.collaborators);
  const [roomID, setRoomID] = useState(model.roomID);
  const [leader, setLeader] = useState(model.leader);
  const [followers, setFollowers] = useState(model.getFollowerAsUsers());

  useEffect(() => {
    function collabListener(m: Message) {
      if (m === Message.COLLAB_STARTED) {
        setRoomID(model.roomID);
      } else if (m === Message.COLLAB_STOPPED) {
        setRoomID(model.roomID);
        setCollaborators([...model.collaborators]);
      } else if (m === Message.USER_JOIN || m === Message.USER_LEFT) {
        setCollaborators([...model.collaborators]);
      } else if (m === Message.FOLLOWER_CHANGE) {
        setFollowers([...model.getFollowerAsUsers()]);
      } else if (m === Message.LEADER_CHANGE) {
        setLeader(model.leader);
      }
    }
    model.addObserver(collabListener);
    return () => model.removeObserver(collabListener);
  }, []);

  const saveFileOnClick = () => {
    model.saveContentIntoFile();
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomID);
    toast.success('Copied!');
  };

  const diffWith = leader ? [...followers, ...[leader]] : followers;
  const potentialLeaders = differenceWith(
    collaborators,
    diffWith,
    (l1, l2) => l1.id === l2.id
  );

  if (leader)
    potentialLeaders.unshift({
      name: 'Stop following',
      id: 'unfollow',
      color: '',
    });

  return (
    <IdeHeaderView
      removeCollaborator={removeCollaborator}
      leaveProject={leaveProject}
      tutorial={tutorial}
      startFollowOnClick={startFollowOnClick}
      createRoom={createRoom}
      leaveRoom={leaveRoom}
      roomID={roomID}
      collaborators={collaborators}
      potentialLeaders={potentialLeaders}
      isCollab={!!roomID}
      saveFileOnClick={saveFileOnClick}
      leader={leader}
      isHost={model.isHost}
      logout={logout}
      name={model.name}
      copyRoomId={copyRoomId}
    />
  );
}
