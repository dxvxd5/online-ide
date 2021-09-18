/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Message from './Message';

const Messages = (props: {
  handleSendMessage: (...args: any[]) => any;
  message: string;
  setMessage: (...args: any[]) => any;
  messages: { username: string; message: string }[];
  username: string;
}) => {
  return (
    <div className="messages">
      <ul className="message-list scrollable">
        {props.messages.map((message, i) => (
          <Message
            key={i + message.username}
            message={message}
            username={props.username}
          />
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.handleSendMessage();
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={props.message}
          onChange={(e) => props.setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messages;
