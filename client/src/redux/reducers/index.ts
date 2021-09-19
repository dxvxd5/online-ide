import { combineReducers } from 'redux';
import challengesReducer from './challengesReducer';
import currentUserReducer from './currentUserReducer';
import testingReducer from './testingReducer';

const rootReducer = combineReducers({
  currentUserReducer,
  challengesReducer,
  testingReducer,
});

export default rootReducer;
