import { cloneDeep } from 'lodash';

import API from './api';
import Message from './message';
import ColorGenerator from '../../utils/color-generator';
import FileTreeGenerator from '../../utils/file-tree-generator';
import { NodeState as FileTree } from '../../utils/file-tree-node';

export enum EditorContentOperationType {
  REPLACEMENT,
  DELETION,
  INSERTION,
}

enum FileTreeOperation {
  ADD = 'addNode',
  RENAME = 'renameNode',
  DELETE = 'deleteNode',
  INITIALIZATION = 'initialization',
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

  constructor() {
    this.name = '';
    this.userID = '';
    this.username = '';
    this.observers = [];
    this.projects = [];
    this.collaborators = [];
    this.currentTabFiles = [];
    this.isHost = true;
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

  addFileToCurrentProject(file: FileData): void {
    this.currentProject.files.push(file);
    this.notifyObservers(Message.CURRENT_PROJECT_CHANGE);
  }

  setFileContentToSave(content: string): void {
    this.contentToSave = content;
    this.notifyObservers(Message.SAVE_FILE_CONTENT);
  }

  setRoomCreator(roomCreator: SparseUserData): void {
    this.roomCreator = roomCreator;
    this.notifyObservers(Message.ROOM_CREATOR);
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

  setLeaver(leaver: SparseUserData): void {
    this.leaver = leaver;
  }

  setCurrentFileTree(files: FileData[], projectRootFolderName: string): void {
    this.currentFileTree = FileTreeGenerator.generateFileTree(
      projectRootFolderName,
      files
    ).toState();
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

  setCurrentProject(project: CompleteProjectData): void {
    this.currentProject = project;
    this.setCurrentFileTree(project.files, project.name);
    this.notifyObservers(Message.CURRENT_PROJECT);
  }

  setFocusedFile(file: FileData | null): void {
    this.focusedFile = file;
    this.notifyObservers(Message.FOCUSED_FILE);
  }

  stopCollaboration(): void {
    this.formerCollaborators = this.collaborators;
    this.collaborators = [];
    this.roomID = '';
    this.isHost = true;
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
    this.setLeaver(leaver);
    this.notifyObservers(Message.USER_LEFT);
  }

  moveCollabCursorPosition(position: CursorPosition, userID: string): void {
    this.collabCursor = { position, id: userID };
    this.notifyObservers(Message.CURSOR_MOVED);
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
    (await API.saveFileContent(
      this.userID,
      this.currentProject.id,
      this.focusedFile.id,
      this.contentToSave
    )) as FileData;
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

  async getFileContent(fileID: string): Promise<string> {
    if (!this.currentProject) throw new Error('No project opened');
    return (await API.getFileContent(
      this.userID,
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
    const project = (await API.getProject(
      this.userID,
      collabId
    )) as CompleteProjectData;
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

  private async createFile(
    name: string,
    creationDate: number
  ): Promise<FileData> {
    const fileData = await API.createFile(
      this.userID,
      this.currentProject.id,
      name,
      creationDate
    );
    return fileData as FileData;
  }

  private async renameFile(
    name: string,
    lastUpdated: number,
    fileID: string
  ): Promise<void> {
    try {
      API.editFile(this.userID, this.currentProject.id, fileID, {
        name,
        lastUpdated,
      });

      const i = this.currentTabFiles.findIndex((file) => file.id === fileID);
      if (i >= 0) {
        this.currentTabFiles[i].name = name;
        this.notifyObservers(Message.CURRENT_TABS);
      }
    } catch {
      console.log('Error when updating file');
    }
  }

  private async deleteFile(fileID: string): Promise<void> {
    try {
      API.deleteFile(this.userID, this.currentProject.id, fileID);

      const i = this.currentTabFiles.findIndex((file) => file.id === fileID);
      if (i >= 0) {
        this.currentTabFiles.splice(i, 1);

        // Open a another file
        if (this.currentTabFiles.length) {
          const newFocusIdx = i === 0 ? 0 : i - 1;
          this.setFocusedFile(this.currentTabFiles[newFocusIdx]);
        } else this.resetFocusedFile();

        this.notifyObservers(Message.CURRENT_TABS);
      }
    } catch {
      console.log('Error when deleting file');
    }
  }

  async applyFileTreeChange(
    newTree: FileTree,
    event: TreeChangeEvent
  ): Promise<void> {
    if (event.type === FileTreeOperation.INITIALIZATION) return;

    switch (event.type) {
      case FileTreeOperation.ADD: {
        if (event.params[0]) return;
        const node = this.getTreeNodeFromPath(event.path, newTree);
        const newFile = await this.createFile(
          `${node.filePath}/new file`,
          Date.now()
        );

        if (node.children) {
          node.children[0].fileID = newFile.id;
          node.children[0].filePath = newFile.name;
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
        console.log({
          newTree,
          path: event.path,
          oldTree: this.currentFileTree,
        });
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

  notifyObservers(message: Message): void {
    this.observers.forEach((obs) => obs(message));
  }
}
