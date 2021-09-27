import { Request, Response } from 'express';
import File from '../models/file.model';
import User from '../models/user.model';
import HttpError from '../utils/httperror';

// export async function getFiles(req: Request, res: Response): Promise<void> {
//   try {
//     const userID = req.params.userID || req.userID;
//     const projectID = req.params.projectID || req.projectID;

//     if (!(userID && projectID))
//       res.status(400).send('Please specify a user ID and a project ID');
//     else {
//       if (!(await User.isUserExist(userID)))
//         res.status(404).send(`User with ID ${userID} does not exist`);
//       else if (!(await Project.isProjectExist(projectID)))
//         res.status(404).send(`Project with ID ${projectID} does not exist`);
//       else {
//         const files = await File.getFromUser;
//       }
//     }
//   } catch (error) {
//     res.status(500).send(error);
//   }
// }

export async function getFilesFromUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userID = req.params.userID || req.userID;

    if (!userID)
      res.status(400).json({
        error: new HttpError('Please specify a user ID and a project ID', 400),
      });
    else {
      const isUserExist = await User.isUserExist(userID);
      if (!isUserExist)
        res.status(404).json({
          error: new HttpError(`User with ID ${userID} does not exist`, 404),
        });
      else {
        const files = await File.getFromUser(userID);
        res.status(200).json({ files });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
export function deleteFile(req: Request, res: Response) {}
