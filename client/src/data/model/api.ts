import axios, { Method } from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// console.log({ API_BASE_URL });

interface Projects {
  projects: Array<unknown>;
}

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
      .then((response: { data: any }) => response.data)
      .catch(function (error: {
        response: { data: any; status: any; headers: any };
        request: string | undefined;
        message: string | undefined;
      }) {
        if (error.response) {
          const errorData = {
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers,
          };

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

  static getAllUserProjects(userID: string): Promise<unknown> {
    const request = {
      url: `users/${userID.toString()}/projects`,
      method: 'GET' as Method,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return API.call(request).then((data) => {
      const projects = data as Projects;
      return projects.projects;
    });
  }

  static createProject(
    userID: string,
    name: string,
    creationDate: number
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/create`,
      method: 'POST' as Method,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { name, creationDate },
    };

    return API.call(request);
  }

  static async getProject(userID: string, projectID: string): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/${projectID}`,
      method: 'GET' as Method,
      withCredentials: true,
    };

    return API.call(request);
  }

  static async getFileContent(
    userID: string,
    projectID: string,
    fileID: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/${projectID}/files/${fileID}/content`,
      method: 'GET' as Method,
      withCredentials: true,
    };
    return API.call(request).then((data) => {
      return data;
    });
  }
}
