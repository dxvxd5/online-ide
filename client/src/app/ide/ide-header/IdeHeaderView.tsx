import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import './ideHeader.css';
import IdeModel from '../../../data/model/model';

interface IdeHeaderViewProps {
  createRoom: () => void;
  roomID: string;
  collaborators: { name: string; id: string }[];
  isCollab: boolean;
  leaveRoom: (roomId: string) => void;
  saveFileOnClick: () => void;
  startFollowOnClick: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  model: IdeModel;
  stopFollowing: () => void;
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
  model,
}: IdeHeaderViewProps): JSX.Element {
  return (
    <div className="ide--header">
      {!isCollab && (
        <>
          <button type="button" onClick={() => createRoom()}>
            Create Room
          </button>
        </>
      )}
      {isCollab && (
        <button type="button" onClick={() => leaveRoom(roomID)}>
          Leave room
        </button>
      )}
      <select id="selectLeaderToFollow" value="" onChange={startFollowOnClick}>
        <option>Follow...</option>
        {model.collaborators.map((collaborator) => (
          <option value={JSON.stringify(collaborator)} key={collaborator.id}>
            {collaborator.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => stopFollowing()}>
        Stop Following
      </button>
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
