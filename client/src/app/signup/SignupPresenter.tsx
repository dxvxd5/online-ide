import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import IdeModel from '../../data/model/model';
import SignUpView from './SignUpView';
import { signUpSchema } from '../../utils/yup-schemas';
import toastPromise from '../../utils/toast';

interface SignUpPresenterProp {
  model: IdeModel;
}

export default function SignUpPresenter({
  model,
}: SignUpPresenterProp): JSX.Element {
  const [signUpError, setSignUpError] = useState('');
  const history = useHistory();

  function redirectTo(to: 'me' | 'login') {
    history.push({
      pathname: `/${to}`,
    });
  }

  const signUp = (credentials: {
    name: string;
    password: string;
    username: string;
  }) => {
    const { name, password, username } = credentials;

    const promise = model.signUp(name, username, password).then(() => {
      if (signUpError) setSignUpError('');
      redirectTo('me');
    });

    const msgs = {
      success: `Successfully signed up as ${username}`,
      loading: 'Signing you up...',
      error: 'Failed to sign up',
    };

    toastPromise(promise, msgs).catch((error) => {
      if (error.error.statusCode === 400) {
        setSignUpError('Username already in use');
      } else {
        setSignUpError('Something went wrong. Please try again.');
      }
    });
  };

  useEffect(() => {
    if (model.isLoggedIn) redirectTo('me');
  }, []);

  const logIn = () => {
    redirectTo('login');
  };

  return (
    <SignUpView
      logIn={logIn}
      signUpSchema={signUpSchema}
      signUpError={signUpError}
      click={signUp}
    />
  );
}
