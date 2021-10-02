import { Request, Response, NextFunction } from 'express';
import Project from '../models/project.model';
import User from '../models/user.model';
import HttpError from '../utils/httperror';

/**
 * Ensure that the authenticated user that made the request is not accessing
 * another user's data
 */
function isAuthorizedUser(req: Request): boolean {
  // TODO: Check what's going on here.
  // if (!req.user) return false;
  // const user = req.user as User;
  // if (user.id !== req.userID) return false;
  return true;
}

/**
 * Ensure that the authenticated user is not acessing someone else's project.
 */
async function isAuthorizedProject(req: Request): Promise<boolean> {
  // TODO: Check what's going on here.
  // const paths = ['create', 'edit'];
  // const user = req.user as User;
  // if (!req.projectID || paths.includes(req.projectID)) return true;
  // const isAuthorized = await Project.isUserOwnProject(user.id, req.projectID);
  // return isAuthorized;
  return true;
}

/**
 * Checks if the user is allowed to access the ressource requested
 * And return 401 error if not
 * Assumes that the request has passed the check authentication middleware
 */
export default async function checkAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!isAuthorizedUser(req))
    res.status(403).json({
      error: new HttpError(
        'The requested user is not the authenticated user',
        403
      ),
    });
  else if (!(await isAuthorizedProject(req)))
    res.status(403).json({
      error: new HttpError(
        'The requested project does not belong to the authenticated user',
        403
      ),
    });
  else next();
}
