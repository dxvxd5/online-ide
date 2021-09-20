import _ from 'lodash';
import {
  firestore,
  getProjectBasePath,
  getProjectPath,
} from '../config/firebase';

interface FileData {
  name: string;
  projectID: string;
  id: string;
  lastUpdated: number;
}

export default class File {
  readonly id: string;

  readonly projectID: string;

  name: string;

  lastUpdated: number;

  /** Return all the files in a project of a user.
   * Assumes that both the user and the project exist in database and the project belongs to the user.
   * */
  static async getFromProject(
    userID: string,
    projectID: string
  ): Promise<File[]> {
    const projectDocRef = firestore.doc(getProjectPath(userID, projectID));
    const filesColSnapshot = await projectDocRef.collection('files').get();
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

  /** Return all the files of a user.
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

  constructor({ name, projectID, id, lastUpdated }: FileData) {
    this.name = name;
    this.projectID = projectID;
    this.id = id;
    this.lastUpdated = lastUpdated;
  }
}
