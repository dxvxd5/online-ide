// import API_BASE_URL from '../../config/env.variables';

const API_BASE_URL = 'http://localhost:5000';

// console.log({ API_BASE_URL });

export default class API {
  private static createRequest(
    apiEndpoint: string,
    method: 'POST' | 'GET' | 'PATCH',
    headers: Headers,
    body: string
  ): Request {
    const requestParams = { method, headers, body };

    return new Request(`${API_BASE_URL}/${apiEndpoint}`, requestParams);
  }

  // This function makes the API call an return the results
  // Request must be a Request object
  private static apiCall(request: Request) {
    return fetch(request)
      .then((response) => {
        console.log(response.headers.get('set-cookie'));
        console.log(document.cookie); // nope
        if (!response.ok) {
          throw new Error(response.statusText);
        } else {
          return response;
        }
      })
      .then((response) => response.json())
      .catch((err) => {
        throw err;
      });
  }

  static logIn(username: string, password: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify({
      username,
      password,
    });

    const request = this.createRequest('', 'POST', headers, body);
    return this.apiCall(request);
  }
}
