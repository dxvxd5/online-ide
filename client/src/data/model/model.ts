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

export default class IdeModel {
  name: string;

  userID: string;

  username: string;

  observers: Array<Observer>;

  constructor() {
    this.name = '';
    this.userID = '';
    this.username = '';
    this.observers = [];
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

  login(userName: string, password: string): void {
    API.logIn(userName, password).then((data) => {
      const { username, id, name } = data as UserData;
      this.setName(name);
      this.setUserID(id);
      this.setUsername(username);
    });
    this.notifyObservers(Message.LOGIN);
  }

  notifyObservers(message: Message): void {
    this.observers.forEach((obs) => obs(message));
  }
}
