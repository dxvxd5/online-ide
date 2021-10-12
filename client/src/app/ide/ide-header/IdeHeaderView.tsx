import React from 'react';

import './ideHeader.css';
import {
  Collaborator,
  SparseUserData as User,
} from '../../../data/model/model';

interface IdeHeaderViewProps {
  createRoom: () => void;
  roomID: string;
  leader: User | null;
  collaborators: Collaborator[];
  potentialLeaders: Collaborator[];
  isCollab: boolean;
  leaveRoom: (roomId: string) => void;
  saveFileOnClick: () => void;
  startFollowOnClick: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  stopFollowing: () => void;
  logout: () => void;
}

export default function IdeHeaderView({
  createRoom,
  roomID,
  collaborators,
  isCollab,
  leaveRoom,
  saveFileOnClick,
  startFollowOnClick,
  stopFollowing,
  potentialLeaders,
  leader,
  logout,
}: IdeHeaderViewProps): JSX.Element {
  return (
    <div className="ide--header">
      <button type="button" onClick={logout}>
        Log out
      </button>
      {!isCollab && (
        <>
          <button type="button" onClick={() => createRoom()}>
            Create Room
          </button>
        </>
      )}
      {isCollab && (
        <>
          <button type="button" onClick={() => leaveRoom(roomID)}>
            Leave room
          </button>
          <select
            id="selectLeaderToFollow"
            value=""
            onChange={startFollowOnClick}
          >
            <option>{leader ? leader.name : 'Follow...'}</option>
            {potentialLeaders.map((collaborator) => (
              <option
                value={JSON.stringify(collaborator)}
                key={collaborator.id}
              >
                {collaborator.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => stopFollowing()}>
            Stop Following
          </button>
        </>
      )}
      <button type="button" onClick={() => saveFileOnClick()}>
        Save File
      </button>
      {roomID && <div> {roomID}</div>}
      {collaborators &&
        collaborators.map((collaborator) => (
          <span key={collaborator.id}>{collaborator.name}</span>
        ))}
    </div>
  );
}
