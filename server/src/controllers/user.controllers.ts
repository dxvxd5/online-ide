import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import HttpError from '../utils/httperror';
import { issueJWT } from '../utils/jwt';
import { isPasswordValid } from '../utils/password';

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userID } = req.params;
    const user = await User.getFromId(userID);
    if (!user)
      res
        .status(404)
        .json({ error: new HttpError(`No user with id ${userID}`, 404) });
    else res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function logIn(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).json({
        error: new HttpError(
          `Please specify all of the following: username, password. You only specified ${
            username ? 'username' : ''
          }, ${password ? 'password' : ''}`,
          400
        ),
      });
      return;
    }

    const userData = await User.getFromUsername(username);
    if (!userData || !isPasswordValid(password, userData.hash, userData.salt)) {
      res.status(401).json({ error: new HttpError('wrong credentials', 401) });
      return;
    }

    const user = new User(userData);
    const jwtToken = issueJWT(user);
    res.status(200).json({ ...user, jwtToken });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function signUpUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, username, password } = req.body;
    if (!(name && username && password))
      res.status(400).json({
        error: new HttpError(
          `Please specify all of the following: username, password and name. You only specified  ${
            name ? 'name' : ''
          }, ${username ? 'username' : ''}, ${password ? 'password' : ''}`,
          400
        ),
      });
    else if (await User.isUserExistUsername(username))
      res
        .status(400)
        .json({ error: new HttpError('username already in use', 400) });
    else {
      const newUser = await User.create(username, password, name);
      const jwtToken = issueJWT(newUser);
      res.status(200).json({ ...newUser, jwtToken });
    }
  } catch (error) {
    next(error);
  }
}
