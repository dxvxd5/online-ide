import initialState from './initialState';

function testingReducer(
  state = initialState.backend,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case 'DATA_FROM_BACKEND':
      return action.payload;
    case 'GET_DATA':
      return action.payload;
    default:
      return state;
  }
}

export default testingReducer;
