import { cloneDeep } from 'lodash';

import API from './api';
import Message from './message';
import ColorGenerator from '../../utils/color-generator';
import FileTreeGenerator from '../../utils/file-tree-generator';
import { NodeState as FileTree } from '../../utils/file-tree-node';
import { getFileLanguage } from '../../utils/file-extension';

export enum StorageItem {
  JWT = 'crrt',
  UID = 'crrsub',
  PROJECT = 'crrprj',
  FOC_FILE = 'crrfcfl',
  TABS = 'crrtb',
  CONTENT = 'crrctt',
  NAME = 'crnnm',
  UNAME = 'crunnm',
  HOST = 'crrohs',
  ROOM = 'crrm',
  SCK = 'crsck',
}

export enum EditorContentOperationType {
  REPLACEMENT,
  DELETION,
  INSERTION,
}

export enum FileTreeOperation {
  ADD = 'addNode',
  RENAME = 'renameNode',
  DELETE = 'deleteNode',
  INITIALIZATION = 'initialization',
  CHECK = 'checkNode',
  TOGGLE_OPEN = 'toggleOpen',
}

type Observer = {
  (message: Message): void;
};

export interface TreeChangeEvent {
  type: FileTreeOperation;
  path: number[];
  params: Array<boolean | string>;
}
export interface CursorPosition {
  column: number;
  lineNumber: number;
}

export interface CursorSelection {
  start: CursorPosition;
  end: CursorPosition;
}

export interface EditorContentOperation {
  type: EditorContentOperationType;
  index: number;
}

export interface Deletion extends EditorContentOperation {
  length: number;
}

export interface Insertion extends EditorContentOperation {
  text: string;
}

export interface Replacement extends Insertion, Deletion {}

export interface SparseUserData {
  name: string;
  id: string;
}
interface UserData extends SparseUserData {
  username: string;
}

interface CompleteUserData extends UserData {
  jwtToken: JWT;
}

export interface Collaborator extends SparseUserData {
  color: string;
  focusedFile: FileData | null;
}

export interface CollaboratorCursor {
  id: string;
  position: CursorPosition;
}

export interface CollaboratorSelection {
  id: string;
  selection: CursorSelection;
}

export interface FileData {
  id: string;
  name: string;
}

export interface CompleteFileData extends FileData {
  content: string;
}

export interface ProjectData {
  name: string;
  shared: boolean;
  id: string;
  lastUpdated: number;
}

export interface CompleteProjectData extends ProjectData {
  owner: SparseUserData;
  collaborators: SparseUserData[];
  files: FileData[];
  creationDate: number;
}

export interface FollowerData {
  socketID: string;
  user: {
    id: string;
    name: string;
  };
}

export interface ScrollPosition {
  scrollLeft: number;
  scrollTop: number;
}

export interface JWT {
  token: string;
  expiresIn: number;
  expires: number;
}

export default class IdeModel {
  name: string;

  userID: string;

  leaver!: SparseUserData;

  joiner!: Collaborator;

  username: string;

  projects: ProjectData[];

  observers: Array<Observer>;

  roomID!: string;

  // the currently opened project
  currentProject!: CompleteProjectData;

  // The file tree of the project
  currentFileTree!: FileTree;

  // the currently focus file
  focusedFile: FileData | null = null;

  // the current collaborators on the project
  collaborators: Collaborator[];

  // the former collaborators on the project
  formerCollaborators!: Collaborator[];

  // Color generator
  colorGenerator!: ColorGenerator;

  // the collaborative cursor position to update
  collabCursor!: CollaboratorCursor;

  // the collaborative selection to update
  collabSelection!: CollaboratorSelection;

  // editor content operation to apply to the editor
  collabContentOperation!: EditorContentOperation;

  // the currently opened files in the current project(TABs)
  currentTabFiles: FileData[];

  contentToSave!: string;

  roomCreator!: SparseUserData;

  isHost: boolean;

  followers: FollowerData[];

  leader!: SparseUserData | null;

  scrollPosition!: ScrollPosition;

  isLeader: boolean;

  jwt!: JWT;

  isLoggedIn = false;

  isCoding = false;

  persisted = false;

  language!: string;

  constructor() {
    this.name = '';
    this.userID = '';
    this.username = '';
    this.observers = [];
    this.projects = [];
    this.collaborators = [];
    this.currentTabFiles = [];
    this.isHost = true;
    this.followers = [];
    this.isLeader = false;
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

  addObserver(o: Observer): void {
    this.observers.push(o);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  setName(name: string): void {
    this.name = name;
    this.notifyObservers(Message.NAME_CHANGE);
    IdeModel.saveToLocalStorage(StorageItem.NAME, name);
  }

  setLanguage(language: string): void {
    this.language = language;
  }

  setJWT(token: JWT): void {
    this.jwt = { ...token, expires: Date.now() + token.expiresIn };
    IdeModel.saveToLocalStorage(StorageItem.JWT, JSON.stringify(this.jwt));
  }

  setUserID(userID: string): void {
    this.userID = userID;
    IdeModel.saveToLocalStorage(StorageItem.UID, userID);
    this.notifyObservers(Message.ID_CHANGE);
  }

  setUsername(username: string): void {
    this.username = username;
    this.notifyObservers(Message.USERNAME_CHANGE);
    IdeModel.saveToLocalStorage(StorageItem.UNAME, username);
  }

  setProjects(projects: ProjectData[]): void {
    this.projects = projects;
    this.notifyObservers(Message.PROJECTS_CHANGE);
  }

  setFileContentToSave(content: string): void {
    this.contentToSave = content;
    IdeModel.saveToSessionStorage(StorageItem.CONTENT, content);
  }

  private setFollowers(followers: FollowerData[]): void {
    this.followers = followers;
    this.notifyObservers(Message.FOLLOWER_CHANGE);
  }

  setIsLeader(isLeader: boolean): void {
    this.isLeader = isLeader;
  }

  addFollower(follower: FollowerData): void {
    const follAlreadyExists = this.followers.some(
      (f) => f.user.id === follower.user.id
    );
    if (follAlreadyExists) return;

    this.followers.push(follower);
    this.notifyObservers(Message.FOLLOWER_CHANGE);
  }

  removeFollower(follower: FollowerData): void {
    const i = this.followers.findIndex((f) => f.user.id === follower.user.id);
    if (i >= 0) {
      this.followers.splice(i, 1);
      this.notifyObservers(Message.FOLLOWER_CHANGE);
    }
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

  getProjects(): ProjectData[] {
    return this.projects;
  }

  getCurrentProject(): CompleteProjectData | null {
    if (!this.currentProject) return null;
    return this.currentProject;
  }

  getCurrentFiles(): FileTree {
    return this.currentFileTree;
  }

  getFocusedFile(): FileData | null {
    return this.focusedFile;
  }

  getFollowerAsUsers(): SparseUserData[] {
    return this.followers.map((follower) => follower.user);
  }

  setLeaver(leaver: SparseUserData): void {
    this.leaver = leaver;
  }

  setLeader(leader: SparseUserData | null): void {
    this.leader = leader;
    this.notifyObservers(Message.LEADER_CHANGE);
  }

  setCurrentFileTree(files: FileData[], projectRootFolderName: string): void {
    this.currentFileTree = FileTreeGenerator.generateFileTree(
      projectRootFolderName,
      files
    ).toState();
  }

  setNewTree(newTree: FileTree): void {
    this.currentFileTree = newTree;
    this.notifyObservers(Message.UPDATE_TREE);
  }

  setCurrentTabFiles(tabFiles: FileData[]): void {
    this.currentTabFiles = tabFiles;
    this.notifyObservers(Message.CURRENT_TABS);
    IdeModel.saveToSessionStorage(
      StorageItem.TABS,
      JSON.stringify(this.currentTabFiles)
    );
  }

  addTabFile(tabFile: FileData): void {
    const tabAlreadyExist = this.currentTabFiles.some(
      (currentTabFile) => currentTabFile.id === tabFile.id
    );
    if (tabAlreadyExist) return;

    this.currentTabFiles.push(tabFile);
    this.notifyObservers(Message.CURRENT_TABS);
    IdeModel.saveToSessionStorage(
      StorageItem.TABS,
      JSON.stringify(this.currentTabFiles)
    );
  }

  private openAnotherTabFile(i: number): void {
    // Open a another file
    if (this.currentTabFiles.length) {
      const newFocusIdx = i === 0 ? 0 : i - 1;
      this.setFocusedFile(this.currentTabFiles[newFocusIdx]);
    } else {
      this.resetFocusedFile();
    }
  }

  closeTabFile(tabFile: FileData): void {
    const i = this.currentTabFiles.findIndex((tf) => tf.id === tabFile.id);
    if (i >= 0) {
      this.currentTabFiles.splice(i, 1);
      if (this.isLeader) {
        if (this.focusedFile.id === tabFile.id) {
          this.notifyObservers(Message.TAB_FILE_CLOSE);
        }
        this.openAnotherTabFile(i);
      } else if (!this.leader) this.openAnotherTabFile(i);
      this.notifyObservers(Message.CURRENT_TABS);
    }
  }

  setCurrentProject(project: CompleteProjectData | null): void {
    this.currentProject = project;
    if (project) this.setCurrentFileTree(project.files, project.name);
    this.notifyObservers(Message.CURRENT_PROJECT);
  }

  setFocusedFile(file: FileData | null): void {
    if (!file && !this.focusedFile) return;
    if (file?.id === this.focusedFile?.id) return;

    if (file) this.setLanguage(getFileLanguage(file.name));
    this.saveContentIntoFile();
    this.focusedFile = file;
    IdeModel.saveToSessionStorage(StorageItem.FOC_FILE, JSON.stringify(file));
    this.notifyObservers(Message.FOCUSED_FILE);
  }

  stopCollaboration(): void {
    this.formerCollaborators = this.collaborators;
    this.collaborators = [];
    this.setFollowers([]);
    this.setLeader(null);
    this.roomID = '';
    if (!this.isHost) {
      this.resetFocusedFile();
      this.resetTabsFiles();
    }
    IdeModel.saveToSessionStorage(StorageItem.ROOM, this.roomID);
    IdeModel.saveToSessionStorage(StorageItem.HOST, `${this.isHost}`);
    this.isHost = true;
    this.notifyObservers(Message.COLLAB_STOPPED);
  }

  addCollaborator(joiner: SparseUserData, focusedFile: FileData | null): void {
    const newCollaborator = {
      ...joiner,
      color: this.colorGenerator?.generateColor(),
      focusedFile: focusedFile ?? null,
    };
    this.collaborators = [...this.collaborators, newCollaborator];
    this.joiner = newCollaborator;
    this.notifyObservers(Message.USER_JOIN);
  }

  updateCollaboratorFocusedFile(
    collaborator: SparseUserData,
    focusedFile: FileData | null
  ): void {
    const i = this.collaborators.findIndex(
      (coll) => coll.id === collaborator.id
    );

    if (i < 0) return;

    this.collaborators[i].focusedFile = focusedFile;
    this.notifyObservers(Message.COLLAB_FOCUSED_FILE_CHANGE);
  }

  startCollaboration(roomID: string, isHost: boolean): void {
    this.colorGenerator = new ColorGenerator();
    this.roomID = roomID;
    IdeModel.saveToSessionStorage(StorageItem.ROOM, roomID);
    this.isHost = isHost;
    if (!isHost) {
      this.resetTabsFiles();
      this.resetFocusedFile();
    }
    IdeModel.saveToSessionStorage(StorageItem.HOST, `${isHost}`);
    this.notifyObservers(Message.COLLAB_STARTED);
  }

  removeCollaborator(leaver: SparseUserData): void {
    const newCollaborators: Collaborator[] = [];

    this.collaborators.forEach((collaborator) => {
      if (collaborator.id === leaver.id) {
        this.colorGenerator.unUseColor(collaborator.color);
      } else {
        newCollaborators.push(collaborator);
      }
    });

    this.collaborators = newCollaborators;
    this.setFollowers(this.followers.filter((f) => f.user.id !== leaver.id));
    if (this.leader?.id === leaver.id) this.setLeader(null);

    this.setLeaver(leaver);
    this.notifyObservers(Message.USER_LEFT);
  }

  moveCollabCursorPosition(position: CursorPosition, userID: string): void {
    this.collabCursor = { position, id: userID };
    this.notifyObservers(Message.CURSOR_MOVED);
  }

  moveCollabScrollPosition(scrollPosition: ScrollPosition): void {
    this.scrollPosition = scrollPosition;
    this.notifyObservers(Message.EDITOR_SCROLL);
  }

  moveCollabSelection(selection: CursorSelection, userID: string): void {
    this.collabSelection = { selection, id: userID };
    this.notifyObservers(Message.EDITOR_SELECTION);
  }

  setCollabContentDeletion(index: number, length: number): void {
    this.collabContentOperation = {
      index,
      length,
      type: EditorContentOperationType.DELETION,
    } as Deletion;
    this.notifyObservers(Message.CONTENT);
  }

  setCollabContentInsertion(index: number, text: string): void {
    this.collabContentOperation = {
      index,
      text,
      type: EditorContentOperationType.INSERTION,
    } as Insertion;
    this.notifyObservers(Message.CONTENT);
  }

  setCollabContentReplacement(
    index: number,
    length: number,
    text: string
  ): void {
    this.collabContentOperation = {
      index,
      length,
      text,
      type: EditorContentOperationType.REPLACEMENT,
    } as Replacement;
    this.notifyObservers(Message.CONTENT);
  }

  notifyHostLeft(): void {
    this.notifyObservers(Message.HOST_LEFT);
  }

  resetTabsFiles(): void {
    this.setCurrentTabFiles([]);
  }

  resetFocusedFile(): void {
    this.setFocusedFile(null);
  }

  async saveContentIntoFile(): Promise<void> {
    if (!this.focusedFile) return;

    const fileOwnerId = this.isHost
      ? this.userID
      : this.currentProject.owner.id;

    API.saveFileContent(
      fileOwnerId,
      this.currentProject.id,
      this.focusedFile.id,
      this.contentToSave,
      this.jwt.token
    );

    API.editFile(
      fileOwnerId,
      this.currentProject.id,
      this.focusedFile.id,
      {
        lastUpdated: Date.now(),
      },
      this.jwt.token
    );

    this.editProject();
  }

  private async fetchProject(projectID: string): Promise<CompleteProjectData> {
    const project = await API.getProject(
      this.userID,
      projectID,
      this.jwt.token
    );

    return project as CompleteProjectData;
  }

  /**
   * Fetch the project with its id and set it as the current opened project.
   */
  // eslint-disable-next-line class-methods-use-this
  async openProject(projectID: string): Promise<void> {
    const project = await this.fetchProject(projectID);
    this.resetTabsFiles();
    this.resetFocusedFile();
    this.setCurrentProject(project);
    this.isHost = true;
    IdeModel.saveToSessionStorage(StorageItem.HOST, `${this.isHost}`);
    IdeModel.saveToSessionStorage(StorageItem.PROJECT, projectID);
  }

  closeProject(): void {
    this.resetTabsFiles();
    this.resetFocusedFile();
    this.setCurrentProject(null);
    IdeModel.saveToSessionStorage(StorageItem.PROJECT, null);
  }

  async getFileContent(fileID: string): Promise<string> {
    if (!this.currentProject) throw new Error('No project opened');
    return (await API.getFileContent(
      this.isHost ? this.userID : this.currentProject.owner.id,
      this.currentProject.id,
      fileID,
      this.jwt.token
    )) as string;
  }

  async login(userName: string, password: string): Promise<void> {
    const { username, id, name, jwtToken } = (await API.logIn(
      userName,
      password
    )) as CompleteUserData;
    this.setUserID(id);
    this.setUsername(username);
    this.setName(name);
    this.setJWT(jwtToken);
    this.isLoggedIn = true;
    this.notifyObservers(Message.LOGIN);
  }

  logout(): void {
    this.stopCollaboration();
    this.closeProject();
    this.setName('');
    this.setUserID('');
    this.setUsername('');
    this.observers = [];
    this.setProjects([]);
    this.currentTabFiles = [];
    this.followers = [];
    this.jwt = undefined;
    this.isLoggedIn = false;
    localStorage.clear();
    sessionStorage.clear();
    this.notifyObservers(Message.LOGOUT);
  }

  async signUp(
    namee: string,
    userName: string,
    password: string
  ): Promise<void> {
    const { username, id, name, jwtToken } = (await API.signUp(
      userName,
      namee,
      password
    )) as CompleteUserData;
    this.setUserID(id);
    this.setUsername(username);
    this.setName(name);
    this.setJWT(jwtToken);
    this.isLoggedIn = true;
    this.notifyObservers(Message.SIGNUP);
  }

  async getAllUserProjects(): Promise<void> {
    const projects = (await API.getAllUserProjects(
      this.userID,
      this.jwt.token
    )) as ProjectData[];
    this.setProjects(projects);
  }

  async createProject(name: string, creationDate: number): Promise<void> {
    const createdProject = (await API.createProject(
      this.userID,
      name,
      creationDate,
      this.jwt.token
    )) as ProjectData;
    this.setProjects([createdProject, ...this.projects]);
  }

  async createCollab(): Promise<string> {
    const roomID = (await API.createCollab(
      this.userID,
      this.currentProject.id,
      this.jwt.token
    )) as string;
    return roomID;
  }

  async getCollabProject(collabId: string): Promise<void> {
    this.roomID = collabId;
    const project = (await API.getCollabProject(
      this.userID,
      collabId,
      this.jwt.token
    )) as CompleteProjectData;
    this.isHost = false;
    this.setCurrentProject(project);
  }

  private recursiveFolderRename(
    node: FileTree,
    event: TreeChangeEvent,
    nodeFilePath: string
  ) {
    if (!node.children) return;
    node.children.forEach((child) => {
      const counter: number = nodeFilePath.split('/').length;
      const filepathname: string = child.filePath
        .split('/')
        .slice(counter)
        .join('/');
      if (child.fileID)
        this.renameFile(
          `${nodeFilePath}/${filepathname}`,
          Date.now(),
          child.fileID
        );
      this.recursiveFolderRename(child, event, nodeFilePath);
    });
  }

  private recursiveFolderDelete(node: FileTree, event: TreeChangeEvent) {
    if (!node.children) return;
    node.children.forEach((child) => {
      if (child.fileID) this.deleteFile(child.fileID);
      this.recursiveFolderDelete(child, event);
    });
  }

  private getTreeNodeFromPath(path: number[], fileTree = this.currentFileTree) {
    let node = fileTree;
    let filePath = node.name;

    path.forEach((p) => {
      if (node.children) {
        node = node.children[p];
        filePath = `${filePath}/${node.name}`;
      } else throw Error('The path is inaccurate');
    });
    node.filePath = filePath;

    return node;
  }

  private async createFile(
    name: string,
    creationDate: number
  ): Promise<FileData | undefined> {
    const fileData = await API.createFile(
      this.isHost ? this.userID : this.currentProject.owner.id,
      this.currentProject.id,
      name,
      creationDate,
      this.jwt.token
    ).catch();
    return fileData as FileData;
  }

  private renameTabFile(fileID: string, name: string): void {
    const i = this.currentTabFiles.findIndex((file) => file.id === fileID);
    if (i >= 0) {
      this.currentTabFiles[i].name = name;
      this.notifyObservers(Message.CURRENT_TABS);
      IdeModel.saveToSessionStorage(
        StorageItem.TABS,
        JSON.stringify(this.currentTabFiles)
      );

      if (this.currentTabFiles[i].id === this.focusedFile?.id) {
        this.setLanguage(getFileLanguage(this.currentTabFiles[i].name));
        this.setFocusedFile(this.currentTabFiles[i]);
        this.notifyObservers(Message.FOCUSED_FILE);
      }
    }
  }

  private async editProject(): Promise<void> {
    API.editProject(
      this.isHost ? this.userID : this.currentProject.owner.id,
      this.currentProject.id,
      {
        lastUpdated: Date.now(),
      },
      this.jwt.token
    ).catch();

    const i = this.projects.findIndex(
      (project) => project.id === this.currentProject.id
    );
    if (i >= 0) {
      this.projects[i].lastUpdated = Date.now();
      this.notifyObservers(Message.PROJECTS_CHANGE);
    }
  }

  async deleteProject(projectID: string): Promise<void> {
    API.deleteProject(this.userID, projectID, this.jwt.token);
    this.deleteProjectFromProjects(projectID);
  }

  private async renameFile(
    name: string,
    lastUpdated: number,
    fileID: string
  ): Promise<void> {
    API.editFile(
      this.isHost ? this.userID : this.currentProject.owner.id,
      this.currentProject.id,
      fileID,
      {
        name,
        lastUpdated,
      },
      this.jwt.token
    ).catch();
    this.renameTabFile(fileID, name);
  }

  private deleteTabFile(fileID: string): void {
    const i = this.currentTabFiles.findIndex((file) => file.id === fileID);
    if (i >= 0) {
      this.currentTabFiles.splice(i, 1);

      // Open a another file
      this.openAnotherTabFile(i);

      this.notifyObservers(Message.CURRENT_TABS);
      IdeModel.saveToSessionStorage(
        StorageItem.TABS,
        JSON.stringify(this.currentTabFiles)
      );
    }
  }

  private deleteProjectFromProjects(projectID: string): void {
    const i = this.projects.findIndex((project) => project.id === projectID);
    if (i >= 0) {
      this.projects.splice(i, 1);
      this.notifyObservers(Message.PROJECTS_CHANGE);
    }
  }

  private replaceFocusedFile(fileID: string) {
    if (!(fileID === this.focusedFile.id)) return;
    if (this.currentTabFiles.length)
      this.setFocusedFile(this.currentTabFiles[0]);
    else this.setFocusedFile(null);
  }

  private async deleteFile(fileID: string): Promise<void> {
    API.deleteFile(
      this.isHost ? this.userID : this.currentProject.owner.id,
      this.currentProject.id,
      fileID,
      this.jwt.token
    ).catch();
    this.replaceFocusedFile(fileID);
    this.deleteTabFile(fileID);
  }

  async applyFileTreeChange(
    newTree: FileTree,
    event: TreeChangeEvent
  ): Promise<void> {
    switch (event.type) {
      case FileTreeOperation.ADD: {
        if (event.params[0]) return;
        const node = this.getTreeNodeFromPath(event.path, newTree);
        const newFile = await this.createFile(
          `${node.filePath}/new file`,
          Date.now()
        );

        if (!newFile) return;

        if (node.children) {
          node.children[0].fileID = newFile.id;
          node.children[0].filePath = newFile.name;
        }
        break;
      }

      case FileTreeOperation.RENAME: {
        const node = this.getTreeNodeFromPath(event.path, newTree);
        this.saveContentIntoFile();
        if (node.fileID) {
          this.renameFile(node.filePath, Date.now(), node.fileID);
        } else {
          this.recursiveFolderRename(node, event, node.filePath);
        }
        break;
      }

      case FileTreeOperation.DELETE: {
        const node = this.getTreeNodeFromPath(event.path);
        if (node.fileID) {
          this.deleteFile(node.fileID);
        } else {
          this.recursiveFolderDelete(node, event);
        }
        break;
      }
      default:
        break;
    }

    this.currentFileTree = cloneDeep(newTree);
  }

  private recursiveDeleteTabFiles(
    newTree: FileTree,
    oldTabFiles: FileData[],
    oldFocusedFile: FileData | null
  ): void {
    if (!newTree.children) return;
    newTree.children.forEach((child) => {
      if (child.fileID) {
        const i = oldTabFiles.findIndex((file) => file.id === child.fileID);
        if (i >= 0) {
          this.currentTabFiles.push(oldTabFiles[i]);
        }
        if (oldFocusedFile?.id === child.fileID)
          this.focusedFile = { id: child.fileID, name: child.name };
      }
      this.recursiveDeleteTabFiles(child, oldTabFiles, oldFocusedFile);
    });
  }

  updateTabs(newTree: FileTree, event: TreeChangeEvent): void {
    switch (event.type) {
      case FileTreeOperation.RENAME: {
        const node = this.getTreeNodeFromPath(event.path, newTree);
        if (node.fileID) this.renameTabFile(node.fileID, node.name);
        break;
      }
      case FileTreeOperation.DELETE: {
        const oldTabFiles = [...this.currentTabFiles];
        const oldFocusedFile = {
          ...this.focusedFile,
        } as typeof this.focusedFile;
        this.currentTabFiles = [];
        this.focusedFile = null;
        this.recursiveDeleteTabFiles(newTree, oldTabFiles, oldFocusedFile);
        if (!this.focusedFile && this.currentTabFiles.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          this.focusedFile = this.currentTabFiles[0];
        }
        this.notifyObservers(Message.FOCUSED_FILE);
        this.notifyObservers(Message.CURRENT_TABS);
        IdeModel.saveToSessionStorage(
          StorageItem.TABS,
          JSON.stringify(this.currentTabFiles)
        );

        break;
      }
      default:
        break;
    }
  }

  setPersisted(persisted: boolean): void {
    this.persisted = persisted;
  }

  async restoreProject(): Promise<void> {
    const projId = IdeModel.getFromSessionStorage(StorageItem.PROJECT);
    if (!projId) throw new Error(`No project to be restored`);

    const focFile = IdeModel.getFromSessionStorage(StorageItem.FOC_FILE);
    const tabs = IdeModel.getFromSessionStorage(StorageItem.TABS);
    const content = IdeModel.getFromSessionStorage(StorageItem.CONTENT);

    const project = await this.fetchProject(projId as string);
    this.currentProject = project;
    this.setCurrentFileTree(project.files, project.name);
    if (content !== undefined) this.contentToSave = content as string;
    if (focFile) this.setFocusedFile(focFile as FileData);
    if (tabs) this.setCurrentTabFiles(tabs as FileData[]);
    this.notifyObservers(Message.UPDATE_TREE);
  }

  persist(): void {
    const jwt = IdeModel.getFromLocalStorage(StorageItem.JWT) as JWT;
    const id = IdeModel.getFromLocalStorage(StorageItem.UID) as string;
    const name = IdeModel.getFromLocalStorage(StorageItem.NAME) as string;
    const uname = IdeModel.getFromLocalStorage(StorageItem.UNAME) as string;

    if (!(jwt && id && name && uname)) return;

    const expireIn = jwt.expires - Date.now();
    const oneHour = 60 * 60 * 1000;
    if (expireIn < oneHour) return;

    this.jwt = jwt;
    this.userID = id;
    this.name = name;
    this.username = uname;

    this.isLoggedIn = true;

    this.persisted = true;

    const isHost = IdeModel.getFromSessionStorage(StorageItem.HOST);
    if (isHost !== null) this.isHost = isHost as boolean;

    const projId = IdeModel.getFromSessionStorage(StorageItem.PROJECT);
    if (!projId) return;

    this.isCoding = true;
  }

  notifyObservers(message: Message): void {
    this.observers.forEach((obs) => obs(message));
  }
}
