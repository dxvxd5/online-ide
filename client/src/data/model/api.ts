// import API_BASE_URL from '../../config/env.variables';
import axios, { Method } from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// console.log({ API_BASE_URL });

interface Request {
  url: string;
  method: Method;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  withCredentials?: boolean;
}
export default class API {
  private static fetcher = axios.create({
    baseURL: API_BASE_URL,
    responseType: 'json',
    // timeout: 1000,
  });

  private static call(request: Request): Promise<unknown> {
    return API.fetcher
      .request(request)
      .then((response) => response.data)
      .catch(function (error) {
        if (error.response) {
          const errorData = {
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers,
          };
          throw new Error(JSON.stringify(errorData));

          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(JSON.stringify(errorData));
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw new Error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(error.message);
        }
      });
  }

  static logIn(username: string, password: string): Promise<unknown> {
    const request = {
      url: 'login',
      method: 'POST' as Method,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { username, password },
    };

    return API.call(request);
  }
}
