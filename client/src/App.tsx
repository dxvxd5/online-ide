import React from 'react';
import { Toaster } from 'react-hot-toast';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';

import IdeModel from './data/model/model';
import Persister from './data/persistence/persistence';
import LoginPresenter from './app/login/LoginPresenter';
import PersonalSpacePresenter from './app/personal-space/PersonalSpacePresenter';
import IdePresenter from './app/ide/IdePresenter';
import SignupPresenter from './app/signup/SignupPresenter';

import './assets/styles/app.css';
import prevDefaultShortcuts from './utils/shortcuts';

function App(): JSX.Element {
  prevDefaultShortcuts();
  const ideModel = new IdeModel();
  const persister = new Persister(ideModel);
  persister.persist();
  return (
    <Router>
      <Route exact path="">
        <Redirect to="/login" />
      </Route>
      <Route
        path="/login"
        exact
        component={() => <LoginPresenter model={ideModel} />}
      />
      <Route
        path="/signup"
        exact
        component={() => <SignupPresenter model={ideModel} />}
      />
      <Route
        path="/me"
        exact
        component={() => <PersonalSpacePresenter model={ideModel} />}
      />
      <Route
        path="/code"
        exact
        component={() => <IdePresenter model={ideModel} />}
      />
      <Toaster />
    </Router>
  );
}

export default App;
