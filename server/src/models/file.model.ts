/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import {
  firestore,
  getFileBasePath,
  getFileContentBasePath,
  getFileContentPath,
  getFilePath,
  getProjectBasePath,
  getProjectPath,
} from '../config/firebase';

interface FileData {
  name: string;
  projectID: string;
  id: string;
  lastUpdated: number;
}

interface CompleteFileData extends FileData {
  owner: { id: string; name: string };
  creationDate: number;
}

interface EditableFileData {
  name?: string;
  lastUpdated?: number;
}

export default class File {
  readonly id: string;

  readonly projectID: string;

  name: string;

  lastUpdated: number;

  static async createFile(
    userID: string,
    projectID: string,
    userName: string,
    fileName: string,
    creationDate: number
  ): Promise<File> {
    const fileData = {
      name: fileName,
      creationDate,
      lastUpdated: creationDate,
      owner: { id: userID, name: userName },
      projectID,
    };

    const fileContentRef = await firestore
      .collection(getFileContentBasePath(userID, projectID))
      .add({ content: '' });

    const projectRef = await firestore
      .collection(getFileBasePath(userID, projectID))
      .add({ ...fileData, contentID: fileContentRef.id });

    return new File({ id: projectRef.id, ...fileData });
  }

  private static async _getFileContentPath(
    userID: string,
    projectID: string,
    fileID: string
  ): Promise<false | string> {
    const filePath = getFilePath(userID, projectID, fileID);
    const fileDoc = (await firestore.doc(filePath).get()).data();
    if (!fileDoc) return false;

    const contentID = fileDoc.contentID as string;
    const fileContentPath = getFileContentPath(userID, projectID, contentID);

    return fileContentPath;
  }

  static async getFromId(
    projectID: string,
    userID: string,
    fileID: string
  ): Promise<CompleteFileData | null> {
    const fileDoc = await firestore
      .doc(getFilePath(userID, projectID, fileID))
      .get();

    if (!fileDoc.exists) return null;

    return { ...fileDoc.data(), id: fileID } as CompleteFileData;
  }

  private static async _getFileDoc(
    projectID: string,
    userID: string,
    fileID: string
  ): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | null> {
    const fileDoc = await firestore
      .doc(getFilePath(userID, projectID, fileID))
      .get();

    return fileDoc.exists ? fileDoc : null;
  }

  static async editFile(
    projectID: string,
    userID: string,
    fileID: string,
    toEdit: EditableFileData
  ): Promise<boolean> {
    const fileDoc = await File._getFileDoc(projectID, userID, fileID);
    if (!fileDoc) return false;
    await fileDoc.ref.update(toEdit);
    return true;
  }

  static async deleteFile(
    projectID: string,
    userID: string,
    fileID: string
  ): Promise<boolean> {
    const fileDoc = await File._getFileDoc(projectID, userID, fileID);
    const fileContentPath = await File._getFileContentPath(
      userID,
      projectID,
      fileID
    );
    if (!(fileDoc && fileContentPath)) return false;

    await fileDoc.ref.delete();
    await firestore.doc(fileContentPath).delete();

    return true;
  }

  /**
   * Return all the files in a project of a user.
   * Assumes that both the user and the project exist in database and the project belongs to the user.
   * */
  static async getFromProject(
    userID: string,
    projectID: string
  ): Promise<File[]> {
    const projectDocRef = firestore.doc(getProjectPath(userID, projectID));
    const filesColSnapshot = await projectDocRef
      .collection('files')
      .orderBy('name', 'desc')
      .get();
    if (filesColSnapshot.empty) return [];
    const userFiles: File[] = [];
    filesColSnapshot.forEach((fileSnapshot) => {
      const fileData = fileSnapshot.data();
      userFiles.push(
        new File({
          projectID,
          name: fileData.name,
          id: fileSnapshot.id,
          lastUpdated: fileData.lastUpdated,
        })
      );
    });
    return userFiles;
  }

  /**
   * Return all the files of a user.
   * Assumes that the user exists in the database.
   * */
  static async getFromUser(userID: string): Promise<File[]> {
    const projectsSnaphot = await firestore
      .collection(getProjectBasePath(userID))
      .get();

    if (projectsSnaphot.empty) return [];

    const userFiles: Promise<File[]>[] = [];
    projectsSnaphot.forEach((projectSnapshot) => {
      const projectFiles = File.getFromProject(userID, projectSnapshot.id);
      userFiles.push(projectFiles);
    });
    return Promise.all(userFiles).then((nestedFileArrays) =>
      _.flatten(nestedFileArrays)
    );
  }

  static async getContent(
    projectID: string,
    userID: string,
    fileID: string
  ): Promise<null | string> {
    const fileContentPath = await File._getFileContentPath(
      userID,
      projectID,
      fileID
    );
    if (!fileContentPath) return null;

    const fileContentData = (
      await firestore.doc(fileContentPath).get()
    ).data() as { content: string };

    return fileContentData.content;
  }

  static async updateContent(
    projectID: string,
    userID: string,
    fileID: string,
    fileContent: Buffer
  ): Promise<boolean> {
    const fileContentPath = await File._getFileContentPath(
      userID,
      projectID,
      fileID
    );
    if (!fileContentPath) return false;

    await firestore.doc(fileContentPath).update({ content: fileContent });

    return true;
  }

  constructor({ name, projectID, id, lastUpdated }: FileData) {
    this.name = name;
    this.projectID = projectID;
    this.id = id;
    this.lastUpdated = lastUpdated;
  }
}
