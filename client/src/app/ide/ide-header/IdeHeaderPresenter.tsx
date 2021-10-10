import React, { useEffect, useState } from 'react';
import { differenceWith } from 'lodash';
import Message from '../../../data/model/message';
import IdeModel from '../../../data/model/model';
import IdeHeaderView from './IdeHeaderView';

interface IdeHeaderPresenterProps {
  createRoom: () => void;
  leaveRoom: (roomID: string) => void;
  model: IdeModel;
  startFollowOnClick: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  stopFollowing: () => void;
  leaveProject: () => void;
}

export default function IdeHeaderPresenter({
  createRoom,
  leaveRoom,
  model,
  startFollowOnClick,
  stopFollowing,
  leaveProject,
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

  const diffWith = leader ? [...followers, ...[leader]] : followers;
  const potentialLeaders = differenceWith(
    collaborators,
    diffWith,
    (l1, l2) => l1.id === l2.id
  );

  return (
    <IdeHeaderView
      leaveProject={leaveProject}
      stopFollowing={stopFollowing}
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
    />
  );
}
