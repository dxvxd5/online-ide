import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import IdeModel from '../../data/model/model';
import ProjectError from '../components/error/ProjectError';
import Loader from '../components/loader/Loader';
import SingupView from './SignupView';

interface SingupPresenterProp {
  model: IdeModel;
}

export default function SingupPresenter({
  model,
}: SingupPresenterProp): JSX.Element {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isProjectLoaded, setProjectLoaded] = useState(false);
  const [signupErrorInfo, setSignupErrorInfo] = useState('');
  const [signupError, setSignupError] = useState(false);
  const [projectErrorInfo, setProjectErrorInfo] = useState('');
  const [projectError, setProjectError] = useState(false);
  const history = useHistory();

  const click = async ({
    name,
    username,
    password,
  }: {
    name: string;
    username: string;
    password: string;
  }) => {
    try {
      await model.signup(name, username, password);
      setIsSignedUp(true);
      if (signupError) setSignupError(false);
    } catch {
      setSignupErrorInfo('Error. Could not sign up.');
      setSignupError(true);
    }
  };

  if (isSignedUp && !isProjectLoaded && !projectError) {
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

  if (isSignedUp && isProjectLoaded && !signupError) {
    history.push({
      pathname: '/me',
    });
  }

  return (
    <SingupView
      signupError={signupError}
      signupErrorInfo={signupErrorInfo}
      click={click}
    />
  );
}
