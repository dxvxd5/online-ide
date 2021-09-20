import admin from 'firebase-admin';
import { FIREBASE_CONFIG } from './env.variables';

admin.initializeApp({ credential: admin.credential.cert(FIREBASE_CONFIG) });

const firestore = admin.firestore();

const userBasePath = '/users';

// Functions to get the path to the different elements in the database
function getUserPath(userID: string): string {
  return `${userBasePath}/${userID}`;
}

function getProjectBasePath(userID: string): string {
  return `${getUserPath(userID)}/projects`;
}

function getProjectPath(userID: string, projectID: string): string {
  return `${getProjectBasePath(userID)}/${projectID}`;
}

function getFileBasePath(userID: string, projectID: string): string {
  return `${getProjectPath(userID, projectID)}/files`;
}

function getFilePath(
  userID: string,
  projectID: string,
  fileID: string
): string {
  return `${getFileBasePath(userID, projectID)}/${fileID}`;
}

export {
  userBasePath,
  firestore,
  getFileBasePath,
  getFilePath,
  getProjectBasePath,
  getProjectPath,
  getUserPath,
};
