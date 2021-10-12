import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import IdeModel from '../../data/model/model';
import LoginView from './LoginView';
import Loader from '../components/loader/Loader';
import ProjectError from '../components/error/ProjectError';
import { loginSchema } from '../../utils/yup-schemas';

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
      if (loginError) setLoginError(false);
    } catch (error) {
      console.log('error: ', error);
      // TODO: Check error when server side is done
      setLoginErrorInfo('Error. Either username or password is incorrect');
      setLoginError(true);
    }
  };

  useEffect(() => {
    if (model.isLoggedIn) history.push({ pathname: '/me' });
  }, []);

  const signUp = () => {
    history.push({ pathname: '/signup' });
  };

  if (isLoggedIn && !isProjectLoaded && !projectError) {
    model
      .getAllUserProjects()
      .then(() => {
        setProjectLoaded(true);
        setProjectError(false);
      })
      .catch(() => {
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

  return (
    <LoginView
      signUp={signUp}
      loginSchema={loginSchema}
      loginError={loginError}
      loginErrorInfo={loginErrorInfo}
      click={click}
    />
  );
}
