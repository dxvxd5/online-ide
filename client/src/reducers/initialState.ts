import faker from 'faker';

const myJSON = '["mmmm1111", "aaaa4444", "dddd2222", "hhhh5555", "rrrr3333"]';
const tokens = JSON.parse(myJSON);

const initialState = {
  challenges: tokens,
  currentUser: faker.internet.userName(),
  backend: {
    dataFromBackend: {},
    getDataFromBackend: {},
  },
};

export default initialState;
