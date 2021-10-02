/* eslint-disable react/destructuring-assignment */
import React from 'react';

const EnterUsername = (props: {
  handleConnection: () => void;
  username: string | number | readonly string[] | undefined;
  setUsername: (arg0: string) => void;
}) => {
  return (
    <form
      className="enter-username-form"
      onSubmit={(e) => {
        e.preventDefault();
        props.handleConnection();
      }}
    >
      <input
        type="text"
        // eslint-disable-next-line react/destructuring-assignment
        value={props.username}
        onChange={(e) => props.setUsername(e.target.value)}
        placeholder="Enter your username..."
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default EnterUsername;
