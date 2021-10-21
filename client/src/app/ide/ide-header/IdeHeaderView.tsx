import React from 'react';

import {
  Collaborator,
  SparseUserData as User,
} from '../../../data/model/model';
import Button from '../../components/button/Button';
import Profile from '../../components/profile/Profile';

interface IdeHeaderViewProps {
  createRoom: () => void;
  copyRoomId: () => void;
  roomID: string;
  leader: User | null;
  collaborators: Collaborator[];
  potentialLeaders: Collaborator[];
  isCollab: boolean;
  leaveRoom: (roomId: string) => void;
  startFollowOnClick: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  leaveProject: () => void;
  tutorial: () => Promise<void>;
  isHost: boolean;
  removeCollaborator: (collaborator: Collaborator) => void;
  logout: () => void;
  name: string;
}

export default function IdeHeaderView({
  createRoom,
  roomID,
  collaborators,
  isCollab,
  leaveRoom,
  startFollowOnClick,
  potentialLeaders,
  leader,
  leaveProject,
  tutorial,
  isHost,
  removeCollaborator,
  logout,
  name,
  copyRoomId,
}: IdeHeaderViewProps): JSX.Element {
  return (
    <div className="ide__header header">
      <Profile name={name} color="#341a58" />
      {isHost && (
        <Button
          submit={false}
          theme="secondary"
          onClick={leaveProject}
          text="Back"
          className="header__button ide__header-button"
        />
      )}
      <Button
        submit={false}
        theme="secondary"
        onClick={() => tutorial()}
        text="tutorial"
        className="header__button ide__header-button"
      />
      {isHost && roomID && (
        <Button
          submit={false}
          theme="secondary"
          onClick={copyRoomId}
          text="Copy session ID"
          className="header__button ide__header-button"
        />
      )}
      {isCollab ? (
        <Button
          submit={false}
          theme="main"
          onClick={() => leaveRoom(roomID)}
          text={isHost ? 'Stop session' : 'Leave session'}
          className="header__button ide__header-button ide__header-button--left-border"
        />
      ) : (
        <Button
          submit={false}
          theme="main"
          onClick={createRoom}
          text="Start new collaboration"
          className="header__button ide__header-button  ide__header-button--left-border"
        />
      )}
      {collaborators && !!collaborators.length && (
        <>
          <select
            value=""
            onChange={startFollowOnClick}
            className="select ide__header-select"
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
          <div className="ide__header-collaborators">
            {collaborators.map((collaborator) => (
              <Profile
                key={collaborator.id}
                color={collaborator.color}
                name={collaborator.name}
                remove={isHost ? () => removeCollaborator(collaborator) : null}
                className={`ide__header-collaborator ${
                  isHost ? 'ide__header-collaborator--delete' : ''
                }`}
              />
            ))}
          </div>
        </>
      )}
      <Button
        text="Log out"
        onClick={logout}
        theme="red"
        submit={false}
        className="header__button header__button--logout ide__header-button ide__header-button--logout"
      />
    </div>
  );
}
