import { cloneDeep } from 'lodash';

import API from './api';
import Message from './message';
import ColorGenerator from '../../utils/color-generator';
import FileTreeGenerator from '../../utils/file-tree-generator';
import { NodeState as FileTree } from '../../utils/file-tree-node';

enum FileOperationType {
  RENAME,
  DELETE,
  ADD,
}
interface FileOperation {
  type: FileOperationType;
  name: string;
}

interface FileDeleteOperation extends FileOperation {
  fileID: string;
}

interface FileCreateOperation extends FileOperation {
  name: string;
  creationDate: number;
}

interface FileRenameOperation extends FileOperation {
  fileID: string;
  name: string;
  lastUpdated: number;
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

export interface Collaborator extends SparseUserData {
  color: string;
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

interface ProjectData {
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

export default class IdeModel {
  name: string;

  userID: string;

  leaver!: SparseUserData;

  joiner!: Collaborator;

  username: string;

  projects: ProjectData[];

  // project: ProjectData;

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

  setProjects(projects: ProjectData[]): void {
    this.projects = projects;
    this.notifyObservers(Message.PROJECTS_CHANGE);
  }

  setFileContentToSave(content: string): void {
    this.contentToSave = content;
  }

  private setFollowers(followers: FollowerData[]): void {
    this.followers = followers;
    this.notifyObservers(Message.FOLLOWER_CHANGE);
  }

  setIsLeader(isLeader: boolean): void {
    this.isLeader = isLeader;
  }

  addFollower(follower: FollowerData): void {
    if (!this.followers.some((f) => f.user.id === follower.user.id)) {
      this.followers.push(follower);
      this.notifyObservers(Message.FOLLOWER_CHANGE);
    }
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
  }

  addTabFile(tabFile: FileData): void {
    if (
      !this.currentTabFiles.some(
        (currentTabFile) => currentTabFile.id === tabFile.id
      )
    ) {
      this.currentTabFiles.push(tabFile);
      this.notifyObservers(Message.CURRENT_TABS);
    }
  }

  private openAnotherTabFile(i: number): void {
    // Open a another file
    if (this.currentTabFiles.length) {
      const newFocusIdx = i === 0 ? 0 : i - 1;
      this.setFocusedFile(this.currentTabFiles[newFocusIdx]);
    } else {
      console.log('resetFocusedFile is called');
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
        console.log('this.isLeader model closeTabFile');
        this.openAnotherTabFile(i);
      } else if (!this.leader) this.openAnotherTabFile(i);
      this.notifyObservers(Message.CURRENT_TABS);
    }
  }

  setCurrentProject(project: CompleteProjectData): void {
    this.currentProject = project;
    this.setCurrentFileTree(project.files, project.name);
    this.notifyObservers(Message.CURRENT_PROJECT);
  }

  setFocusedFile(file: FileData | null): void {
    if (!file && !this.focusedFile) return;
    if (file?.id === this.focusedFile?.id) return;

    this.saveContentIntoFile();
    this.focusedFile = file;
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
    this.isHost = true;
    this.getAllUserProjects();
    this.notifyObservers(Message.COLLAB_STOPPED);
  }

  addCollaborator(joiner: SparseUserData): void {
    const newCollaborator = {
      ...joiner,
      color: this.colorGenerator?.generateColor(),
    };
    this.collaborators = [...this.collaborators, newCollaborator];
    this.joiner = newCollaborator;
    this.notifyObservers(Message.USER_JOIN);
  }

  startCollaboration(roomID: string, isHost: boolean): void {
    this.colorGenerator = new ColorGenerator();
    this.roomID = roomID;
    this.isHost = isHost;
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
      this.contentToSave
    );

    API.editFile(fileOwnerId, this.currentProject.id, this.focusedFile.id, {
      lastUpdated: Date.now(),
    });

    this.editProject();
  }

  /**
   * Fetch the project with its id and set it as the current opened project.
   */
  // eslint-disable-next-line class-methods-use-this
  async openProject(projectID: string): Promise<void> {
    const project = (await API.getProject(
      this.userID,
      projectID
    )) as CompleteProjectData;
    this.resetTabsFiles();
    this.resetFocusedFile();
    this.setCurrentProject(project);
  }

  closeProject(): void {
    this.resetTabsFiles();
    this.resetFocusedFile();
    this.setCurrentProject(null);
  }

  async getFileContent(fileID: string): Promise<string> {
    if (!this.currentProject) throw new Error('No project opened');
    return (await API.getFileContent(
      this.isHost ? this.userID : this.currentProject.owner.id,
      this.currentProject.id,
      fileID
    )) as string;
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

  async signup(
    namee: string,
    userName: string,
    password: string
  ): Promise<void> {
    const { username, id, name } = (await API.signUp(
      userName,
      namee,
      password
    )) as UserData;
    this.setUserID(id);
    this.setUsername(username);
    this.setName(name);
    this.notifyObservers(Message.SIGNUP);
  }

  async getAllUserProjects(): Promise<void> {
    const projects = (await API.getAllUserProjects(
      this.userID
    )) as ProjectData[];
    this.setProjects(projects);
  }

  async createProject(name: string, creationDate: number): Promise<void> {
    const createdProject = (await API.createProject(
      this.userID,
      name,
      creationDate
    )) as ProjectData;
    this.setProjects([createdProject, ...this.projects]);
  }

  async createCollab(): Promise<string> {
    const roomID = (await API.createCollab(
      this.userID,
      this.currentProject.id
    )) as string;
    return roomID;
  }

  async getCollabProject(collabId: string): Promise<void> {
    this.roomID = collabId;
    const project = (await API.getCollabProject(
      this.userID,
      collabId
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
    // TODO: Do nothing if the path correspond to the root
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

  private async fileOperation(o: FileOperation): Promise<FileData | void> {
    if (!this.isHost) return;

    switch (o.type) {
      case FileOperationType.ADD: {
        // eslint-disable-next-line consistent-return
        return this.createFile(
          (o as FileCreateOperation).name,
          (o as FileCreateOperation).creationDate
        );
      }
      case FileOperationType.RENAME: {
        this.renameFile(
          (o as FileRenameOperation).name,
          (o as FileRenameOperation).lastUpdated,
          (o as FileRenameOperation).fileID
        );
        break;
      }
      case FileOperationType.DELETE: {
        this.deleteFile((o as FileDeleteOperation).fileID);
        break;
      }
      default:
        break;
    }
  }

  private async createFile(
    name: string,
    creationDate: number
  ): Promise<FileData | undefined> {
    try {
      const fileData = await API.createFile(
        this.isHost ? this.userID : this.currentProject.owner.id,
        this.currentProject.id,
        name,
        creationDate
      );
      return fileData as FileData;
    } catch {
      return undefined;
    }
  }

  private renameTabFile(fileID: string, name: string): void {
    const i = this.currentTabFiles.findIndex((file) => file.id === fileID);
    if (i >= 0) {
      this.currentTabFiles[i].name = name;
      this.notifyObservers(Message.CURRENT_TABS);

      if (this.currentTabFiles[i].id === this.focusedFile?.id) {
        this.setFocusedFile(this.currentTabFiles[i]);
        this.notifyObservers(Message.FOCUSED_FILE);
      }
    }
  }

  private async editProject(): Promise<void> {
    try {
      API.editProject(
        this.isHost ? this.userID : this.currentProject.owner.id,
        this.currentProject.id,
        {
          lastUpdated: Date.now(),
        }
      );

      const i = this.projects.findIndex(
        (project) => project.id === this.currentProject.id
      );
      if (i >= 0) {
        this.projects[i].lastUpdated = Date.now();
        this.notifyObservers(Message.PROJECTS_CHANGE);
      }
    } catch {
      console.log('Error when updating project');
    }
  }

  async deleteProject(projectID: string): Promise<void> {
    try {
      API.deleteProject(this.userID, projectID);
      this.deleteProjectFromProjects(projectID);
    } catch {
      console.log('Error when deleting file');
    }
  }

  private async renameFile(
    name: string,
    lastUpdated: number,
    fileID: string
  ): Promise<void> {
    try {
      API.editFile(
        this.isHost ? this.userID : this.currentProject.owner.id,
        this.currentProject.id,
        fileID,
        {
          name,
          lastUpdated,
        }
      );
      this.renameTabFile(fileID, name);
    } catch {
      console.log('Error when updating file');
    }
  }

  private deleteTabFile(fileID: string): void {
    const i = this.currentTabFiles.findIndex((file) => file.id === fileID);
    if (i >= 0) {
      this.currentTabFiles.splice(i, 1);

      // Open a another file
      this.openAnotherTabFile(i);

      this.notifyObservers(Message.CURRENT_TABS);
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
    try {
      API.deleteFile(
        this.isHost ? this.userID : this.currentProject.owner.id,
        this.currentProject.id,
        fileID
      );
      this.replaceFocusedFile(fileID);
      this.deleteTabFile(fileID);
    } catch {
      console.log('Error when deleting file');
    }
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
          // Dummy method to force tree update:
        }

        break;
      }

      case FileTreeOperation.RENAME: {
        const node = this.getTreeNodeFromPath(event.path, newTree);
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
        break;
      }
      default:
        break;
    }
  }

  notifyObservers(message: Message): void {
    this.observers.forEach((obs) => obs(message));
  }
}
