import {
  firestore,
  getProjectBasePath,
  getProjectPath,
  collabBasePath,
  getCollabPath,
} from '../config/firebase';

import File from './file.model';

interface ProjectData {
  name: string;
  shared: boolean;
  lastUpdated: number;
  id: string;
  owner?: { name: string; id: string };
}

interface CompleteProjectData extends ProjectData {
  owner: { name: string; id: string };
  files: File[];
  collaborators: { name: string; id: string }[];
  creationDate: number;
}

interface EditableProjectData {
  name?: string;
  shared?: boolean;
  lastUpdated?: number;
  collaborators?: { name: string; id: string }[];
}

export default class Project {
  readonly id: string;

  name: string;

  shared: boolean;

  lastUpdated: number;

  private static async isProjectExist(
    userID: string,
    projectID: string
  ): Promise<boolean> {
    const projectDataSnapshot = firestore.doc(
      getProjectPath(userID, projectID)
    );
    return (await projectDataSnapshot.get()).exists;
  }

  /**
   * Get all the informations of a project from its id
   */
  static async getFromId(
    projectID: string,
    userID: string
  ): Promise<CompleteProjectData | null> {
    const projectDoc = await firestore
      .doc(getProjectPath(userID, projectID))
      .get();
    if (!projectDoc.exists) return null;
    const projectFiles = (await File.getFromProject(userID, projectID)).map(
      (f) => ({ name: f.name, id: f.id })
    );
    const projectData = {
      id: projectID,
      ...projectDoc.data(),
      files: projectFiles,
    } as CompleteProjectData;
    return projectData;
  }

  /**
   * Get all the projects of a user from the database
   */
  static async getFromUser(userID: string): Promise<Project[]> {
    const projectsSnaphot = await firestore
      .collection(getProjectBasePath(userID))
      .get();

    if (projectsSnaphot.empty) return [];

    const userProjects: Project[] = [];
    projectsSnaphot.forEach((project) => {
      const projectData = project.data();
      userProjects.push(
        new Project({
          id: project.id,
          name: projectData.name,
          shared: projectData.shared,
          lastUpdated: projectData.lastUpdated,
        })
      );
    });

    return userProjects;
  }

  static async isUserOwnProject(
    userID: string,
    projectID: string
  ): Promise<boolean> {
    const projectPath = getProjectPath(userID, projectID);
    const projectExist = (await firestore.doc(projectPath).get()).exists;
    return projectExist;
  }

  static async createProject(
    userID: string,
    userName: string,
    projectName: string,
    creationDate: number
  ): Promise<Project> {
    const projectData = {
      name: projectName,
      lastUpdated: creationDate,
      creationDate,
      owner: { id: userID, name: userName },
      collaborators: [],
      shared: false,
    };
    const projectRef = await firestore
      .collection(getProjectBasePath(userID))
      .add(projectData);

    return new Project({ id: projectRef.id, ...projectData });
  }

  static async editProject(
    projectID: string,
    userID: string,
    toEdit: EditableProjectData
  ): Promise<boolean> {
    const projectDoc = await firestore
      .doc(getProjectPath(userID, projectID))
      .get();
    if (!projectDoc.exists) return false;
    await projectDoc.ref.update(toEdit);
    return true;
  }

  static async createCollaboration(
    userID: string,
    projectID: string
  ): Promise<null | string> {
    if (!(await Project.isProjectExist(userID, projectID))) return null;

    const projectPath = getProjectPath(userID, projectID);
    const collabRef = await firestore
      .collection(collabBasePath)
      .add({ project: firestore.doc(projectPath) });

    return collabRef.id;
  }

  static async getCollabProject(
    collabID: string
  ): Promise<CompleteProjectData | null> {
    const collabData = (
      await firestore.doc(getCollabPath(collabID)).get()
    ).data();

    if (!collabData) return null;
    const project = collabData.project as FirebaseFirestore.DocumentReference;

    const projectData = (await project.get()).data() as ProjectData;

    const completeProjectData = Project.getFromId(
      project.id,
      projectData?.owner?.id as string
    );

    return completeProjectData;
  }

  static async deleteCollab(collabID: string): Promise<void> {
    const collabRef = firestore.doc(getCollabPath(collabID));
    collabRef.delete();
  }

  constructor({ id, shared, lastUpdated, name }: ProjectData) {
    this.id = id;
    this.shared = shared;
    this.lastUpdated = lastUpdated;
    this.name = name;
  }
}

export function deleteCollab(collabID: string): void {
  Project.deleteCollab(collabID);
}
