import { genSalt, hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";

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

/**
 * Checks whether the user is logged in
 */
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please log in." });
}
