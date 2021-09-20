import {
  firestore,
  getProjectBasePath,
  getProjectPath,
} from '../config/firebase';

interface ProjectData {
  name: string;
  shared: boolean;
  lastUpdated: number;
  id: string;
}

export default class Project {
  readonly id: string;

  name: string;

  shared: boolean;

  lastUpdated: number;

  static async isProjectExist(
    userID: string,
    projectID: string
  ): Promise<boolean> {
    const projectDataSnapshot = firestore.doc(
      getProjectPath(userID, projectID)
    );
    return (await projectDataSnapshot.get()).exists;
  }

  /** Get all the projects of a user from the database */
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

  constructor({ id, shared, lastUpdated, name }: ProjectData) {
    this.id = id;
    this.shared = shared;
    this.lastUpdated = lastUpdated;
    this.name = name;
  }
}
