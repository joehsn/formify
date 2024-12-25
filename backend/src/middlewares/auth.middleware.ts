import { Request, Response, NextFunction } from 'express';
/**
 * Checks whether the user is logged in
 */
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: Please log in.' });
}

export default isAuthenticated;
