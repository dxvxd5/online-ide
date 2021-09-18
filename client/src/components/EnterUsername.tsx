import React from 'react';

const EnterUsername = (props: {
  username: string;
  setUsername: (...args: any[]) => any;
  handleConnection: (...args: any[]) => any; // since handleConnection: Function is not allowed
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
