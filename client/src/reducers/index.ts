import { combineReducers } from 'redux';
import challengesReducer from './challengesReducer';
import currentUserReducer from './currentUserReducer';

const rootReducer = combineReducers({
  currentUserReducer,
  challengesReducer,
});

export default rootReducer;
