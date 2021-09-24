import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/httperror';

/**
 * Checks if the request has been made by an authenticated user
 * Reject the request with a 401 error if not
 */
export default function checkAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isUnauthenticated())
    res
      // TODO: Maybe add the WWW-Authenticate header to the response
      .status(401)
      .json({ error: new HttpError('Authentication required', 401) });
  else {
    next();
  }
}
