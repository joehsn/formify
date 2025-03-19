import { Response, Request } from 'express';
import { z, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import logger from '../utils/logger';
import { hashPass } from '../utils';
import User from '../models/user.model';
import registerSchema from '../lib/schemas/register.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import emailQueue from '../utils/queue';

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

export async function forgotPassword(req: Request, res: Response) {
  if (req.isAuthenticated()) {
    res.status(409).json({
      message: 'Please log out first',
    });
    return;
  }
  try {
    const { email } = z
      .object({
        email: z.string().email(),
      })
      .parse(req.body);

    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.status(404).json({
        message: 'User does not exists',
      });
      return;
    }

    const { JWT_SECRET, CLIENT_URL } = z
      .object({
        JWT_SECRET: z.string(),
        CLIENT_URL: z.string().url(),
      })
      .parse(process.env);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '15m',
    });

    const url = new URL('/reset-password/', CLIENT_URL.toString());
    url.searchParams.append('token', token);

    const emailOptions = {
      name: user.fullname,
      email,
      resetLink: url.toString(),
    };

    // FIXME: It's add to the queue but it doesn't send the actual email.
    // I inspected redis keys and it's there!
    await emailQueue.add('sendEmail', emailOptions);

    res.status(200).json({
      message: 'Reset link sent successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const fromError = fromZodError(error);
      logger.error('An error occurred while sending a token', fromError);
      res.status(400).json({
        message: 'An error occurred while sending a token',
      });
    }
    logger.error('An error occurred while sending a token: ' + error);
    res.status(500).json({
      message: 'An error occurred while sending a token',
    });
  }
}

/**
 * @brief Changes the user's password.
 *
 * This function changes the user's password if the token is valid and the new
 * password is different from the old password.
 *
 * @param req The Express request object containing the token and new password.
 * @param res The Express response object used to send the response.
 * @throws 400 Bad Request if the token is invalid or the new password is the same as the old password.
 * @throws 500 Internal Server Error if an error occurs while changing the password.
 * @throws 404 Not Found if the user doesn't exists.
 */
export async function changePassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = z
      .object({
        token: z.string(),
        newPassword: z.string().min(8),
      })
      .parse(req.body);

    const JWT_SECRET = z.string().parse(process.env.JWT_SECRET);

    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
    };

    const user = await User.findById(decoded._id)
      .select({
        password: true,
      })
      .exec();

    if (!user) {
      res.status(404).json({
        message: "User doesn't exists",
      });
      return;
    }

    const isSamePass = await bcrypt.compare(newPassword, user.password);

    if (isSamePass) {
      res.status(409).json({
        message: "New password can't be the same as the old password",
      });
      return;
    }

    user.password = await hashPass(newPassword);

    await user.save();

    res.status(200).json({
      message: 'Password changed successfully!',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const fromError = fromZodError(error);
      logger.error('An error occurred while changing password', fromError);
      res.status(400).json({
        message: 'An error occurred while changing password',
      });
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({
        message: 'Token expired',
      });
      return;
    }
    logger.error('An error occurred while changing password: ' + error);
    res.status(500).json({
      message: 'An error occurred while changing password',
    });
  }
}
