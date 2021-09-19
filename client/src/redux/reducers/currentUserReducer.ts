import initialState from './initialState';

function currentUserReducer(
  state = initialState.currentUser,
  action: { type: string; payload: string }
) {
  switch (action.type) {
    case 'ASSIGN_USERNAME':
      sessionStorage.setItem('currentUser', action.payload);
      return action.payload;
    default:
      return sessionStorage.currentUser || state;
  }
}

export default currentUserReducer;
