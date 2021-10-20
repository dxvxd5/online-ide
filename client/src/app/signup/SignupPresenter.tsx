import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import IdeModel from '../../data/model/model';
import SignUpView from './SignUpView';
import { signUpSchema } from '../../utils/yup-schemas';

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

  const signUp = async ({
    name,
    username,
    password,
  }: {
    name: string;
    username: string;
    password: string;
  }) => {
    try {
      await model.signUp(name, username, password);
      if (signUpError) setSignUpError('');
      redirectTo('me');
    } catch (error) {
      if (error.error.statusCode === 400) {
        setSignUpError('Username already in use');
      } else {
        setSignUpError('Something went wrong. Please try again.');
      }
    }
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
