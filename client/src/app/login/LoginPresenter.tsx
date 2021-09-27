import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import IdeModel from '../../data/model/model';
import LoginView from './LoginView';
import Loader from '../components/loader/Loader';
import ProjectError from '../components/error/ProjectError';

interface LoginPresenterProp {
  model: IdeModel;
}

export default function LoginPresenter({
  model,
}: LoginPresenterProp): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProjectLoaded, setProjectLoaded] = useState(false);
  const [loginErrorInfo, setLoginErrorInfo] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [projectErrorInfo, setProjectErrorInfo] = useState('');
  const [projectError, setProjectError] = useState(false);
  const history = useHistory();

  const click = async ({ username, password }: Record<string, string>) => {
    try {
      await model.login(username, password);
      setIsLoggedIn(true);
      setLoginError(false);
    } catch (err) {
      // TODO: Check what's in the error and tell the user that the credentials are not good if that's the error
      setLoginErrorInfo('Error. Either username or password is incorrect');
      setLoginError(true);
    }
  };

  if (isLoggedIn && !isProjectLoaded && !projectError) {
    model
      .getAllUserProjects()
      .then(() => {
        setProjectLoaded(true);
        setProjectError(false);
      })
      .catch((err) => {
        // TODO: Do something if there is an error when loading the projects
        setProjectErrorInfo(
          'Error. Could not load the projects. Please try again.'
        );
        setProjectError(true);
      });
    return <Loader />;
  }

  if (projectError) {
    return (
      <ProjectError
        projectErrorInfo={projectErrorInfo}
        tryAgain={() => setProjectError(false)}
      />
    );
  }

  if (isLoggedIn && isProjectLoaded && !loginError) {
    history.push({
      pathname: '/me',
    });
  }

  // if (!isLoggedIn)
  return (
    <LoginView
      loginError={loginError}
      loginErrorInfo={loginErrorInfo}
      click={click}
    />
  );
}
