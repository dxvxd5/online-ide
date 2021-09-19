import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';
import App from './App';
import history from './util/history';
import store from './store/store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={App} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
