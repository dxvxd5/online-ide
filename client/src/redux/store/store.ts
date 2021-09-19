import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import history from '../../util/history';
// import ReduxPromise from 'redux-promise';
// const middleware = applyMiddleware(ReduxPromise);

const store = createStore(
  combineReducers({
    rootReducer,
    routing: routerReducer,
  }),
  applyMiddleware(thunk, routerMiddleware(history))
);

export default store;
