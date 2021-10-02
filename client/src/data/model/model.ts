import API from './api';
import Message from './message';
import ColorGenerator from '../../utils/color-generator';

export enum EditorContentOperationType {
  REPLACEMENT,
  DELETION,
  INSERTION,
}

type Observer = {
  (message: Message): void;
};

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

interface FileData {
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

  // The currently opened files in the currently opened project
  currentFiles: FileData[];

  // the currently focus file
  focusedFile!: FileData;

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

  constructor() {
    this.name = '';
    this.userID = '';
    this.username = '';
    this.observers = [];
    this.projects = [];
    this.currentFiles = [];
    this.collaborators = [];
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

  getCurrentFiles(): FileData[] {
    return this.currentFiles;
  }

  getFocusedFile(): FileData {
    return this.focusedFile;
  }

  setLeaver(leaver: SparseUserData): void {
    this.leaver = leaver;
  }

  setCurrentFiles(files: FileData[]): void {
    this.currentFiles = files;
    this.notifyObservers(Message.CURRENT_FILES);
  }

  setCurrentProject(project: CompleteProjectData): void {
    this.currentProject = project;
    this.notifyObservers(Message.CURRENT_PROJECT);
    // TODO: delete this later
    this.setFocusedFile(this.currentProject.files[0]);
    this.setCurrentFiles(project.files);
  }

  setFocusedFile(file: FileData): void {
    this.focusedFile = file;
    this.notifyObservers(Message.FOCUSED_FILE);
  }

  stopCollaboration(): void {
    this.formerCollaborators = this.collaborators;
    this.collaborators = [];
    this.roomID = '';
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

  startCollaboration(roomID: string): void {
    this.colorGenerator = new ColorGenerator();
    this.roomID = roomID;
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

  /**
   * Fetch the project with its id and set it as the current opened project.
   */
  // eslint-disable-next-line class-methods-use-this
  async openProject(projectID: string): Promise<void> {
    const project = (await API.getProject(
      this.userID,
      projectID
    )) as CompleteProjectData;
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

  async createFile(name: string, creationDate: number): Promise<void> {
    const createdFile = await API.createFile(
      this.userID,
      this.currentProject.id,
      name,
      creationDate
    );
    this.addFileToCurrentProject(createdFile as FileData);
  }

  notifyObservers(message: Message): void {
    this.observers.forEach((obs) => obs(message));
  }
}
