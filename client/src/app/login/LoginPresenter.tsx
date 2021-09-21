import React from 'react';
import IdeModel from '../../data/model/model';
import LoginView from './LoginView';

interface LoginPresenterProp {
  model: IdeModel;
}

export default function LoginPresenter({
  model,
}: LoginPresenterProp): JSX.Element {
  const click = ({ username, password }: Record<string, string>) => {
    model.login(username, password);
  };

  return <LoginView click={click} />;
}
