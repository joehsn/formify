import { Response, Request } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import logger from '../utils/logger';
import { hashPass } from '../utils';
import User from '../models/user.model';
import registerSchema from '../lib/schemas/register.schema';

/**
 * @brief Fetches user data if the user is authenticated.
 *
 * This function retrieves the authenticated user's data from the database
 * using their ID. If the user is not authenticated, it returns a 401 Unauthorized
 * response.
 *
 * @param req The Express request object, containing the authenticated user.
 * @param res The Express response object used to send the response.
 *
 * @throws 401 Unauthorized if the user is not logged in.
 * @throws 500 Internal Server Error if an error occurs while fetching user data.
 */
export async function getUser(req: Request, res: Response) {
  if (!req.isAuthenticated()) {
    res.status(401).json({
      message: 'Unauthorized: Please log in.',
    });
    return;
  }
  try {
    if ('id' in req.user) {
      const user = await User.findById(req.user.id).lean().exec();
      res.status(200).json(user);
    }
  } catch (error) {
    logger.error('An error occured while fetching user data: ' + error);
    res.status(500).json({
      message: 'An error occured while fetching user data',
    });
  }
}

/**
 * @brief Registers a new user in the system.
 *
 * This function validates and hashes the user's password, checks if the email
 * already exists in the database, and creates a new user if the email is unique.
 *
 * @param req The Express request object containing the user's registration data.
 * @param res The Express response object used to send the response.
 *
 * @throws 409 Conflict if the email already exists.
 * @throws 500 Internal Server Error if an error occurs during registration.
 */
export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const isUserExists = await User.findOne({
      email: data.email,
    });

    if (isUserExists) {
      res.status(409).json({
        message: 'User already exists',
      });
      return;
    }

    const hashed = await hashPass(data.password);
    const user = new User({ ...data, password: hashed });
    await user.save();
    res.status(200).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const fromError = fromZodError(error);
      logger.error(
        'An error occurred while parsing user registeration data',
        fromError
      );
      res.status(400).json({
        message: 'An error occurred while parsing user registeration data',
      });
    }
    logger.error('An error occurred while registering a new user: ' + error);
    res.status(500).json({
      message: 'An error occurred while registering a new user',
    });
  }
}

/**
 * @brief Logs the user in by returning a success message and user information.
 *
 * @param req The Express request object, containing the authenticated user.
 * @param res The Express response object used to send the response.
 *
 * @note Assumes that the authentication middleware has already validated the user.
 */
export function login(req: Request, res: Response) {
  res.status(200).json({ message: 'Login successful!', user: req.user });
}

/**
 * @brief Logs the user out if they are authenticated.
 *
 * This function terminates the user's session and returns a success message.
 * If the user is not logged in, it responds with a 401 Unauthorized error.
 *
 * @param req The Express request object.
 * @param res The Express response object used to send the response.
 *
 * @throws 401 Unauthorized if the user is not logged in.
 * @throws 500 Internal Server Error if an error occurs during logout.
 */
export function logout(req: Request, res: Response) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: 'Unauthorized: Please log in.' });
    return;
  }
  req.logout((error) => {
    if (error) {
      logger.error(error);
      res.status(500).json({
        message: 'An error occured while logging the user out',
      });
      return;
    }
    res.status(200).json({
      message: 'User logged out successfully',
    });
  });
}
