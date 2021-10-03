import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IdeModel from './data/model/model';
import LoginPresenter from './app/login/LoginPresenter';
import PersonalSpacePresenter from './app/personal-space/PersonalSpacePresenter';

import IdePresenter from './app/ide/IdePresenter';

function App(): JSX.Element {
  const ideModel = new IdeModel();
  return (
    <Router>
      <div className="container">
        <Route
          path="/login"
          exact
          component={() => <LoginPresenter model={ideModel} />}
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
      </div>
    </Router>
  );
}

export default App;
