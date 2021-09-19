/* eslint-disable react/destructuring-assignment */
import React from 'react';

const User = (props: { user: { id: string; username: string } }) => {
  return (
    <li className="connected-user">
      <img height="100px" src="/user.png" alt="Unknown User" />
      <br />
      <span>{props.user.username}</span>
    </li>
  );
};

export default User;
