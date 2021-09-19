/* eslint-disable react/destructuring-assignment */
import React from 'react';
import User from './User';

const ConnectedUsers = (props: {
  connectedUsers: { id: string; username: string }[];
}) => {
  return (
    <div className="connected-users scrollable">
      <h2>Connected Users</h2>
      <ul>
        {props.connectedUsers.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
};

export default ConnectedUsers;
