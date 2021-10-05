import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import './ideHeader.css';

interface IdeHeaderViewProps {
  createRoom: () => void;
  joinRoom: (roomID: string) => void;
  roomID: string;
  collaborators: { name: string; id: string }[];
  isCollab: boolean;
  leaveRoom: (roomId: string) => void;
  isHost: boolean;
  saveFileOnClick: () => void;
}

export default function IdeHeaderView({
  createRoom,
  joinRoom,
  roomID,
  collaborators,
  isCollab,
  leaveRoom,
  isHost,
  saveFileOnClick,
}: IdeHeaderViewProps): JSX.Element {
  return (
    <div className="ide--header">
      {!isCollab && (
        <>
          <button type="button" onClick={() => createRoom()}>
            Create Room
          </button>
          <Formik
            initialValues={{ roomID: '' }}
            onSubmit={(e) => joinRoom(e.roomID)}
          >
            <Form>
              <p>RoomID: </p>
              <Field type="roomID" name="roomID" />
              <ErrorMessage name="roomID" component="div" />
              <br />
              <button type="submit">Join Room</button>
            </Form>
          </Formik>
        </>
      )}
      {isCollab && (
        <button type="button" onClick={() => leaveRoom(roomID)}>
          Leave room
        </button>
      )}
      {isHost && (
        <button type="button" onClick={() => saveFileOnClick()}>
          Save File
        </button>
      )}
      {roomID && <div> {roomID}</div>}
      {collaborators &&
        collaborators.map((collaborator) => (
          <span key={collaborator.id}>{collaborator.name}</span>
        ))}
    </div>
  );
}
