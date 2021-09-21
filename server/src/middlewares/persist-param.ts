import { Request, Response, NextFunction } from 'express';

export default function persistParams(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Persist the parameters so that they can be accessed by further routers
  const { userID, projectID, fileID } = req.params;
  req.userID = userID;
  req.projectID = projectID;
  req.fileID = fileID;
  next();
}
