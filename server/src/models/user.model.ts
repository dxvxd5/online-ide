/* eslint-disable no-underscore-dangle */
import { firestore, getUserPath, userBasePath } from '../config/firebase';
import { hashPassword, isPasswordValid } from '../utils/password';

interface UserData {
  name: string;
  username: string;
  userID: string;
}

interface CompleteUserData extends UserData {
  hash: string;
  salt: string;
}

export default class User {
  readonly name: string;

  readonly username: string;

  readonly id: string;

  constructor({ name, username, userID }: UserData) {
    this.name = name;
    this.username = username;
    this.id = userID;
  }

  static async create(
    username: string,
    password: string,
    name: string
  ): Promise<User> {
    const { hash, salt } = hashPassword(password);
    const userRef = await firestore
      .collection(userBasePath)
      .add({ username, name, hash, salt });

    return new User({
      name,
      username,
      userID: userRef.id,
    });
  }

  static async isUserExist(userID: string): Promise<boolean> {
    const userDataSnapshot = firestore.doc(getUserPath(userID));
    return (await userDataSnapshot.get()).exists;
  }

  static async isUserExistUsername(userusername: string): Promise<boolean> {
    const userQueryData = firestore
      .collection(userBasePath)
      .where('username', '==', userusername);

    return !(await userQueryData.get()).empty;
  }

  /**
   * Get all the info of a user (even the hash and salt) by its id
   * Must not be exposed outside this class
   */
  private static async _getFromId(
    userID: string
  ): Promise<CompleteUserData | null> {
    const userDataSnapshot = await firestore.doc(getUserPath(userID)).get();
    const userData = userDataSnapshot.data();
    if (!userData) return null;
    return {
      name: userData.name,
      username: userData.username,
      userID,
      hash: userData.hash,
      salt: userData.salt,
    };
  }

  /**
   * Get a user from the database by its id
   */
  static async getFromId(userID: string): Promise<User | null> {
    const userData = await User._getFromId(userID);
    if (!userData) return null;
    return new User(userData);
  }

  /**
   * Get all the info of a user (even the hash and salt) by its username
   */
  static async getFromUsername(
    username: string
  ): Promise<CompleteUserData | null> {
    const userQuerySnapshot = await firestore
      .collection(userBasePath)
      .where('username', '==', username)
      .get();

    if (userQuerySnapshot.empty) return null;

    const userData: CompleteUserData[] = [];

    userQuerySnapshot.forEach((snapshot) => {
      const data = snapshot.data();
      userData.push({
        username: data.username,
        name: data.name,
        userID: snapshot.id,
        hash: data.hash,
        salt: data.salt,
      });
    });

    // Should be only one result in the query snapshot because username are uniques
    return userData[0];
  }

  /**
   * Get a user from the database by its username
   * Assumes that the user exists in the database
   */
  // static async getFromUsername(username: string): Promise<User | null> {
  //   const userData = await User._getFromUsername(username);
  //   if (!userData) return null;
  //   return new User(userData);
  // }

  /**
   * Get a user associated with the credentials.
   */
  static async getFromCredentials(
    username: string,
    password: string
  ): Promise<null | User> {
    const userData = await User.getFromUsername(username);
    if (!userData) return null;

    // Here we know the username is valid so we check the password
    if (!isPasswordValid(password, userData.hash, userData.salt)) return null;

    return new User(userData);
  }
}
