import React from 'react';
import IdeModel from '../../data/model/model';
import LoginView from './LoginView';

interface LoginPresenterProp {
  model: IdeModel;
}

export default function LoginPresenter({
  model,
}: LoginPresenterProp): JSX.Element {
  const click = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const [username] = formData.getAll('username') as string[];
    const [password] = formData.getAll('password') as string[];
    model.login(username, password);
    console.log({ username, password });
    // Do Something...
  };

  return <LoginView click={click} />;
}
