import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import IdeModel from '../../data/model/model';
import LoginView from './LoginView';
import { loginSchema } from '../../utils/yup-schemas';

interface LoginPresenterProp {
  model: IdeModel;
}

export default function LoginPresenter({
  model,
}: LoginPresenterProp): JSX.Element {
  const [loginError, setLoginError] = useState('');
  const history = useHistory();

  function redirectTo(to: 'me' | 'signup' | 'code') {
    history.push({
      pathname: `/${to}`,
    });
  }

  const logIn = async ({ username, password }: Record<string, string>) => {
    try {
      await model.login(username, password);
      if (loginError) setLoginError('');
      redirectTo('me');
    } catch (error) {
      setLoginError('Either username or password is incorrect');
    }
  };

  useEffect(() => {
    if (model.isLoggedIn) {
      if (model.isCoding) redirectTo('code');
      else redirectTo('me');
    }
  }, []);

  const signUp = () => redirectTo('signup');

  return (
    <LoginView
      signUp={signUp}
      loginSchema={loginSchema}
      loginError={loginError}
      logIn={logIn}
    />
  );
}
