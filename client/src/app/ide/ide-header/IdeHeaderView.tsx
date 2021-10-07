import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import './ideHeader.css';

interface IdeHeaderViewProps {
  createRoom: () => void;
  roomID: string;
  collaborators: { name: string; id: string }[];
  isCollab: boolean;
  leaveRoom: (roomId: string) => void;
  saveFileOnClick: () => void;
}

export default function IdeHeaderView({
  createRoom,
  roomID,
  collaborators,
  isCollab,
  leaveRoom,
  saveFileOnClick,
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
