import { genSalt, hash } from 'bcrypt';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

/**
 * Hashes a passed string
 * @param password
 * @returns
 */
export async function hashPass(password: string) {
  const salt = await genSalt(10);
  const hashed = await hash(password, salt);
  return hashed;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    'local',
    (err: unknown, user: Express.User, info: { message: string }) => {
      if (err) {
        // Handle unexpected errors
        return next(err);
      }
      if (!user) {
        // Authentication failed, send custom error message
        return res.status(401).json({ message: info.message });
      }
      // Log in the user
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        next();
      });
    }
  )(req, res, next);
}
