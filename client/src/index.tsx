import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import App from './App';
import rootReducer from './reducers';
// import ReduxPromise from 'redux-promise';

// const middleware = applyMiddleware(ReduxPromise);

const history = createBrowserHistory();

const store = createStore(
  combineReducers({
    rootReducer,
    routing: routerReducer,
  }),
  applyMiddleware(routerMiddleware(history))
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={App} />
      </Switch>
    </Router>
    {/* <HomePage /> */}
  </Provider>,

  document.getElementById('root')
);
