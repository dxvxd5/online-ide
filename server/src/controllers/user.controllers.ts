import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import HttpError from '../utils/httperror';

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
          `Please specify all of the following: username, password and name. You did not specified  ${
            name && 'name'
          }, ${username && 'username'}, ${password && 'password'}`,
          400
        ),
      });
    else if (await User.isUserExistUsername(username))
      res
        .status(400)
        .json({ error: new HttpError('username already in use', 400) });
    else {
      const newUser = await User.create(username, password, name);
      res.status(200).json(newUser);
    }
  } catch (error) {
    next(error);
  }
}
