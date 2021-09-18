/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Moment from 'react-moment';

const Message = (props: {
  message: { message: string; username: string };
  username: string;
}) => {
  const messageReceived = props.message.username !== props.username;

  return (
    <li className={messageReceived ? 'message received' : 'message sended'}>
      <div className="message-info">
        <span>{props.message.username}</span>{' '}
        <Moment format="MM/DD/YYYY h:mm:ss">{Date.now()}</Moment>
      </div>

      <p>{props.message.message}</p>
    </li>
  );
};

export default Message;
