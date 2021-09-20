import React from 'react';
import ReactDOM from 'react-dom';

type ClickFunction = {
  (e: React.FormEvent<HTMLFormElement>): void;
};

interface LoginViewProp {
  click: ClickFunction;
}

const LoginView = ({ click }: LoginViewProp): JSX.Element => {
  /*   const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState(null);
 */
  return (
    <div>
      <form onSubmit={(e) => click(e)}>
        <div>
          <div>Username</div>
          <input
            type="text"
            name="username"
            // onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <div>Password </div>
          <input
            type="password"
            name="password"
            // onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input type="submit" name="Login" />
      </form>
    </div>
  );
};
export default LoginView;
