// Non-permanent file:
function getTokens() {
  const tokens = fetch(`${process.env.API_HOST}/api/v1/challenges`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
  const token = Math.floor(Math.random() * 5) + 1;
  return { type: 'GET_TOKENS', payload: tokens };
}

export default getTokens;
