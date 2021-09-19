import axios from 'axios';

function sendData(url: string, payload: any) {
  return (dispatch: (arg0: { type: string; payload: any }) => void) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        dispatch({ type: 'DATA_FROM_BACKEND', payload: res });
      })
      .catch((err) => {
        console.log('API failed');
      });
  };
}

function getData(url: string) {
  return (dispatch: (arg0: { type: string; payload: any }) => void) => {
    return axios
      .get(url)
      .then((res) => {
        console.log('RES: ', res);
        dispatch({ type: 'GET_DATA', payload: res.data });
      })
      .catch((err) => {
        console.log('API failed');
      });

    /* return fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        dispatch({ type: 'GET_DATA', payload: res });
      })
      .catch((err) => {
        console.log('API failed');
      }); */
  };
}

export default { sendData, getData };
