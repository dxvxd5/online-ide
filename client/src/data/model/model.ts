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

interface ProjectsData {
  name: string;
  shared: boolean;
  id: string;
  lastUpdated: number;
}

export default class IdeModel {
  name: string;

  userID: string;

  username: string;

  projects: ProjectsData[];

  observers: Array<Observer>;

  constructor() {
    this.name = '';
    this.userID = '';
    this.username = '';
    this.observers = [];
    this.projects = [];
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

  setUsername(username: string): void {
    this.username = username;
    this.notifyObservers(Message.USERNAME_CHANGE);
  }

  setProjects(projects: ProjectsData[]): void {
    this.projects = projects;
    this.notifyObservers(Message.PROJECTS_CHANGE);
  }

  getName(): string {
    return this.name;
  }

  getUserID(): string {
    return this.userID;
  }

  getUsername(): string {
    return this.username;
  }

  getProjects(): ProjectsData[] {
    return this.projects;
  }

  async login(userName: string, password: string): Promise<void> {
    const { username, id, name } = (await API.logIn(
      userName,
      password
    )) as UserData;
    this.setUserID(id);
    this.setUsername(username);
    this.setName(name);
    this.notifyObservers(Message.LOGIN);
  }

  async getAllUserProjects(): Promise<void> {
    const projects = (await API.getAllUserProjects(
      this.userID
    )) as ProjectsData[];
    this.setProjects(projects);
    this.notifyObservers(Message.GET_PROJECTS);
  }

  notifyObservers(message: Message): void {
    this.observers.forEach((obs) => obs(message));
  }
}
