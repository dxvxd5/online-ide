import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import IdeModel from '../../data/model/model';
import LoginView from './LoginView';
import { loginSchema } from '../../utils/yup-schemas';
import toastPromise from '../../utils/toast';

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

  const logIn = (credentials: { username: string; password: string }) => {
    const { username, password } = credentials;

    const promise = model.login(username, password).then(() => {
      if (loginError) setLoginError('');
      redirectTo('me');
    });

    const msgs = {
      success: `Successfully logged in as ${username}`,
      error: 'Failed to login',
      loading: 'Logging you in...',
    };

    toastPromise(promise, msgs).catch(() =>
      setLoginError('Either username or password is incorrect')
    );
  };

  useEffect(() => {
    if (model.isLoggedIn) {
      if (model.isCoding || model.isInCollab) redirectTo('code');
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
