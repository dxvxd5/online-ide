import { SidebarItem } from '../../app/sidebar/models/SidebarItem';
import API from './api';
import Message from './message';

type Observer = {
  (message: Message): void;
};

interface UserData {
  name: string;
  username: string;
  id: string;
}

interface FilesData {
  name: string;
  id: string;
}

export default class IdeModel {
  name: string;

  userID: string;

  username: string;

  observers: Array<Observer>;

  files: FilesData[];

  file: FilesData;

  projectID: string;

  constructor() {
    this.name = '';
    this.userID = '';
    this.username = '';
    this.observers = [];
    this.files = [];
    this.file = {} as FilesData;
    this.projectID = '';
  }

  addObserver(o: Observer): void {
    this.observers.push(o);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  setName(name: string): void {
    this.name = name;
    this.notifyObservers(Message.NAME_CHANGE);
  }

  setUserID(userID: string): void {
    this.userID = userID;
    this.notifyObservers(Message.ID_CHANGE);
  }

  getUserID(): string {
    return this.userID;
  }

  setUsername(username: string): void {
    this.username = username;
    this.notifyObservers(Message.USERNAME_CHANGE);
  }

  login(userName: string, password: string): void {
    API.logIn(userName, password).then((data) => {
      const { username, id, name } = data as UserData;
      this.setName(name);
      this.setUserID(id);
      this.setUsername(username);
    });
    this.notifyObservers(Message.LOGIN);
  }

  getProjectID(): string {
    return this.projectID;
  }

  setFiles(files: FilesData[]): void {
    this.files = files;
    this.notifyObservers(Message.FILES_CHANGE);
  }

  getFiles(): FilesData[] {
    return this.files;
  }

  async getAllFilesOfProject(): Promise<void> {
    const files = (await API.getAllFilesOfProjecr(
      this.userID,
      this.projectID
    )) as FilesData[];
    this.setFiles(files);
    this.notifyObservers(Message.GET_FILES);
  }

  async createFile(name: string, creationDate: number): Promise<void> {
    const createdFile = (await API.createFile(
      this.userID,
      this.projectID,
      name,
      creationDate
    )) as FilesData;
    this.setFiles([createdFile, ...this.files]);
  }

  notifyObservers(message: Message): void {
    this.observers.forEach((obs) => obs(message));
  }
}
