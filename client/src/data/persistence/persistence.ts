import Message from '../model/message';
import IdeModel, { JWT, CompleteProjectData, FileData } from '../model/model';
import { NodeState as FileTree } from '../../utils/file-tree-node';

export enum StorageItem {
  JWToken = 'crrt',
  UID = 'crrsub',
  PROJECT = 'crrprj',
  PROJECT_TREE = 'crrprjtr',
  FOC_FILE = 'crrfcfl',
  TABS = 'crrtb',
  CONTENT = 'crrctt',
  NAME = 'crnnm',
  UNAME = 'crunnm',
  HOST = 'crrohs',
  IN_COLLAB = 'crrcollst',
  SCK = 'crsck',
}

export default class Persister {
  model: IdeModel;

  constructor(model: IdeModel) {
    this.model = model;
    this.model.addObserver(this.observer.bind(this));
  }

  static saveToSessionStorage(key: StorageItem, value: string): void {
    sessionStorage.setItem(key, btoa(value));
  }

  private static saveToLocalStorage(key: StorageItem, value: string): void {
    localStorage.setItem(key, btoa(value));
  }

  static getFromSessionStorage(key: StorageItem): null | unknown {
    const v = sessionStorage.getItem(key);
    if (!v) return null;
    const atobv = atob(v);
    try {
      return JSON.parse(atobv);
    } catch (err) {
      return atobv;
    }
  }

  private static getFromLocalStorage(key: StorageItem): null | unknown {
    const v = localStorage.getItem(key);
    if (!v) return null;
    const atobv = atob(v);
    try {
      return JSON.parse(atobv);
    } catch (err) {
      return atobv;
    }
  }

  private observer(m: Message): void {
    switch (m) {
      case Message.NAME_CHANGE: {
        Persister.saveToLocalStorage(StorageItem.NAME, this.model.name);
        break;
      }
      case Message.LOGIN: {
        Persister.saveToLocalStorage(
          StorageItem.JWToken,
          JSON.stringify(this.model.jwt)
        );
        break;
      }
      case Message.SIGNUP: {
        Persister.saveToLocalStorage(
          StorageItem.JWToken,
          JSON.stringify(this.model.jwt)
        );
        break;
      }
      case Message.ID_CHANGE: {
        Persister.saveToLocalStorage(StorageItem.UID, this.model.userID);
        break;
      }
      case Message.USERNAME_CHANGE: {
        Persister.saveToLocalStorage(StorageItem.UNAME, this.model.username);
        break;
      }
      case Message.CURRENT_TABS: {
        Persister.saveToSessionStorage(
          StorageItem.TABS,
          JSON.stringify(this.model.currentTabFiles)
        );
        break;
      }
      case Message.FOCUSED_FILE: {
        Persister.saveToSessionStorage(
          StorageItem.FOC_FILE,
          JSON.stringify(this.model.focusedFile)
        );
        break;
      }
      case Message.COLLAB_STOPPED: {
        Persister.saveToSessionStorage(StorageItem.IN_COLLAB, `${false}`);
        Persister.saveToSessionStorage(
          StorageItem.HOST,
          `${this.model.isHost}`
        );
        break;
      }
      case Message.COLLAB_STARTED: {
        Persister.saveToSessionStorage(StorageItem.IN_COLLAB, `${true}`);
        Persister.saveToSessionStorage(
          StorageItem.HOST,
          `${this.model.isHost}`
        );
        break;
      }
      case Message.OPEN_PROJECT: {
        Persister.saveToSessionStorage(
          StorageItem.PROJECT_TREE,
          JSON.stringify(this.model.currentFileTree)
        );
        Persister.saveToSessionStorage(
          StorageItem.HOST,
          `${this.model.isHost}`
        );
        Persister.saveToSessionStorage(
          StorageItem.PROJECT,
          JSON.stringify(this.model.currentProject)
        );
        break;
      }
      case Message.SAVE_TREE: {
        Persister.saveToSessionStorage(
          StorageItem.PROJECT_TREE,
          JSON.stringify(this.model.currentFileTree)
        );
        break;
      }
      case Message.CLOSE_PROJECT: {
        Persister.saveToSessionStorage(StorageItem.PROJECT, null);
        break;
      }
      default:
        break;
    }
  }

  private persistLogIn(): boolean {
    const jwt = Persister.getFromLocalStorage(StorageItem.JWToken) as JWT;
    const id = Persister.getFromLocalStorage(StorageItem.UID) as string;
    const name = Persister.getFromLocalStorage(StorageItem.NAME) as string;
    const uname = Persister.getFromLocalStorage(StorageItem.UNAME) as string;

    if (!(jwt && id && name && uname)) return false;

    const expireIn = jwt.expires - Date.now();
    const oneHour = 60 * 60 * 1000;
    if (expireIn < oneHour) return false;

    this.model.jwt = jwt;
    this.model.userID = id;
    this.model.name = name;
    this.model.username = uname;

    this.model.isLoggedIn = true;
    this.model.persisted = true;

    return true;
  }

  private persistProject(): boolean {
    const isInCollab = Persister.getFromSessionStorage(StorageItem.IN_COLLAB);
    if (isInCollab !== null) this.model.isInCollab = isInCollab as boolean;

    const isHost = Persister.getFromSessionStorage(StorageItem.HOST);
    if (isHost !== null) this.model.isHost = isHost as boolean;

    const project = Persister.getFromSessionStorage(StorageItem.PROJECT);

    if (!project) return;

    this.model.currentProject = project as CompleteProjectData;

    const focFile = Persister.getFromSessionStorage(StorageItem.FOC_FILE);
    if (focFile) this.model.focusedFile = focFile as FileData;

    const tabs = Persister.getFromSessionStorage(StorageItem.TABS);
    if (tabs) this.model.currentTabFiles = tabs as FileData[];

    const content = Persister.getFromSessionStorage(StorageItem.CONTENT);
    if (content !== undefined) this.model.contentToSave = content as string;

    const projectTree = Persister.getFromSessionStorage(
      StorageItem.PROJECT_TREE
    );
    if (projectTree) this.model.currentFileTree = projectTree as FileTree;

    this.model.isCoding = true;
  }

  persist(): void {
    if (!this.persistLogIn()) return;
    this.persistProject();
  }
}
