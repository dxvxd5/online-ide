import axios, { Method } from 'axios';

const API_BASE_URL = 'http://localhost:5000';

interface Projects {
  projects: Array<unknown>;
}

interface Request {
  url: string;
  method: Method;
  headers?: Record<string, string>;
  data?: Record<string, unknown> | string;
}
export default class API {
  private static fetcher = axios.create({
    baseURL: API_BASE_URL,
    responseType: 'json',
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
      headers: {
        'Content-Type': 'application/json',
      },
      data: { username, password },
    };
    return API.call(request);
  }

  static signUp(
    username: string,
    name: string,
    password: string
  ): Promise<unknown> {
    const request = {
      url: 'signup',
      method: 'POST' as Method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { username, name, password },
    };

    return API.call(request);
  }

  static getAllUserProjects(userID: string, jwt: string): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects`,
      method: 'GET' as Method,
      headers: {
        Authorization: `Bearer ${jwt}`,
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
    creationDate: number,
    jwt: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/create`,
      method: 'POST' as Method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      data: { name, creationDate },
    };

    return API.call(request);
  }

  static editFile(
    userID: string,
    projectID: string,
    fileID: string,
    toUpdate: { name?: string; lastUpdated?: number },
    jwt: string
  ): Promise<unknown> {
    if (!(toUpdate.name || toUpdate.lastUpdated))
      throw new Error('Nothing to update the file with');
    const { name, lastUpdated } = toUpdate;

    let data = {};
    if (name) data = { ...data, name };
    if (lastUpdated) data = { ...data, lastUpdated };

    const request = {
      url: `users/${userID}/projects/${projectID}/files/${fileID}`,
      method: 'PATCH' as Method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      data,
    };

    return API.call(request);
  }

  static deleteFile(
    userID: string,
    projectID: string,
    fileID: string,
    jwt: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/${projectID}/files/${fileID}`,
      method: 'DELETE' as Method,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    return API.call(request);
  }

  static createFile(
    userID: string,
    projectID: string,
    name: string,
    creationDate: number,
    jwt: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/${projectID}/files/create`,
      method: 'POST' as Method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      data: { name, creationDate },
    };
    return API.call(request);
  }

  static saveFileContent(
    userID: string,
    projectID: string,
    fileID: string,
    contentStr: string,
    jwt: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/${projectID}/files/${fileID}/content`,
      method: 'PUT' as Method,
      headers: {
        'Content-Type': 'text/plain;charset=utf-16',
        'Content-Transfer-Encoding': 'BASE64',
        Authorization: `Bearer ${jwt}`,
      },
      data: btoa(contentStr),
    };
    return API.call(request);
  }

  static async getProject(
    userID: string,
    projectID: string,
    jwt: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/${projectID}`,
      method: 'GET' as Method,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    return API.call(request);
  }

  static async getCollabProject(
    userID: string,
    collabID: string,
    jwt: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/collab/${collabID}`,
      method: 'GET' as Method,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    return API.call(request);
  }

  static createCollab(
    userID: string,
    projectID: string,
    jwt: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/${projectID}/collab`,
      method: 'POST' as Method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    };

    return API.call(request).then((d) => {
      const data = d as { roomID: string };
      return data.roomID;
    });
  }

  static async getFileContent(
    userID: string,
    projectID: string,
    fileID: string,
    jwt: string
  ): Promise<unknown> {
    const request = {
      url: `users/${userID}/projects/${projectID}/files/${fileID}/content`,
      method: 'GET' as Method,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
    return API.call(request).then((data) => {
      return atob(data as string);
    });
  }
}
