import initialState from './initialState';

function challengesReducer(
  state = initialState.challenges,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case 'GET_CHALLENGES':
      return action.payload;
    default:
      return state;
  }
}

export default challengesReducer;
