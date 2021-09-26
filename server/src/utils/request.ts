import { Request, Response } from 'express';
import HttpError from './httperror';

export function getUserIdFromReq(req: Request, res: Response): string | null {
  const userID = req.params.userID || req.userID;
  if (!userID) {
    res
      .status(400)
      .json({ error: new HttpError('Please specify a user ID', 400) });
    return null;
  }
  return userID;
}

export function getProjectIdFromReq(
  req: Request,
  res: Response
): string | null {
  const projectID = req.params.projectID || req.projectID;
  if (!projectID) {
    res
      .status(400)
      .json({ error: new HttpError('Please specify a project ID', 400) });
    return null;
  }
  return projectID;
}

export function getFileIdFromReq(req: Request, res: Response): string | null {
  const fileID = req.params.fileID || req.fileID;
  if (!fileID) {
    res
      .status(400)
      .json({ error: new HttpError('Please specify a file ID', 400) });
    return null;
  }
  return fileID;
}
