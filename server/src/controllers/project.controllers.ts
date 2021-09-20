import { Request, Response } from 'express';
import Project from '../models/project.model';
import User from '../models/user.model';

export async function getAllUserProjects(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userID = req.params.userID || req.userID;
    if (userID === undefined) res.status(400).send('Please specify a user ID');
    else {
      const isUserExist = await User.isUserExist(userID);
      if (!isUserExist)
        res.status(404).send(`User with id ${userID} does not exist.`);
      else {
        const projects = await Project.getFromUser(userID);
        res.status(200).json({ projects });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
export function deleteProject(req: Request, res: Response): void {}
