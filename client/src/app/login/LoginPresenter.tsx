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

  function redirectTo(to: 'me' | 'signup') {
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
    if (model.isLoggedIn) redirectTo('me');
  }, []);

  const signUp = () => redirectTo('signup');

  // if (!isProjectLoaded && !projectError) {
  //   model
  //     .getAllUserProjects()
  //     .then(() => {
  //       setProjectLoaded(true);
  //       setProjectError(false);
  //     })
  //     .catch(() => {
  //       setProjectErrorInfo(
  //         'Error. Could not load the projects. Please try again.'
  //       );
  //       setProjectError(true);
  //     });
  //   return <Loader />;
  // }

  // if (projectError) {
  //   return (
  //     <ProjectError
  //       projectErrorInfo={projectErrorInfo}
  //       tryAgain={() => setProjectError(false)}
  //     />
  //   );
  // }

  // if (&& isProjectLoaded) {
  //   history.push({
  //     pathname: '/me',
  //   });
  // }

  return (
    <LoginView
      signUp={signUp}
      loginSchema={loginSchema}
      loginError={loginError}
      logIn={logIn}
    />
  );
}
