import { Request, Response, NextFunction } from 'express';
import Project from '../models/project.model';
import User from '../models/user.model';
import HttpError from '../utils/httperror';

/**
 * Ensure that the authenticated user is not accessing someone else's project.
 */
async function isAuthorizedProject(req: Request): Promise<boolean> {
  const user = req.user as User;

  if (!user) return false;

  if (
    ['create', 'collab', undefined].includes(req.projectID) ||
    !req.projectID
  ) {
    return user.id === req.userID;
  }

  const isOwner = await Project.isUserOwnProject(user.id, req.projectID);
  const { collabID } = req.body;
  console.log(collabID, req.projectID);
  console.log();

  if (!collabID) return isOwner;

  const isCollab = await Project.isProjectInCollab(req.projectID, collabID);

  return isOwner || isCollab;
}

/**
 * Checks if the user is allowed to access the ressource requested
 * And return 403 error if not
 * Assumes that the request has passed the check authentication middleware
 */
export default async function checkAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!(await isAuthorizedProject(req)))
    res.status(403).json({
      error: new HttpError(
        'The authenticated user is not allowed to perform this action',
        403
      ),
    });
  else next();
}
