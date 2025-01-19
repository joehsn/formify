import LocalStrategy from 'passport-local';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';
import createHttpError from 'http-errors';

/**
 * @brief Configures the local authentication strategy using Passport.
 *
 * This strategy checks if the user is already authenticated, verifies the email
 * and password, and returns the user's information if authentication succeeds.
 *
 * @param req The Express request object, passed to allow checking authentication state.
 * @param email The email address provided by the user.
 * @param password The password provided by the user.
 * @param done A callback function to handle the outcome of authentication.
 *
 * @throws 500 Internal Server Error if an error occurs during authentication.
 * @note Returns appropriate messages if the user is already logged in, the email does not exist,
 *       or the password is incorrect.
 */
export const strategy = new LocalStrategy.Strategy(
  {
    usernameField: 'email',
    passReqToCallback: true,
  },
  async function (req, email, password, done) {
    if (req.isAuthenticated()) {
      return done(null, false, {
        message: 'You need to log out first',
      });
    }
    try {
      const user = await User.findOne({ email })
        .select('+password')
        .lean()
        .exec();

      if (!user) {
        return done(null, false, { message: 'User does not exists' });
      }

      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      });
    } catch (error) {
      logger.error(error);
      return done(createHttpError(500, `${error}`));
    }
  }
);

/**
 * @brief Serializes the user for storing in the session.
 *
 * This function processes the user object and passes it to the session storage
 * for future identification.
 *
 * @param user The user object to be serialized.
 * @param done A callback function to indicate completion of the serialization process.
 */
export const userSerialisation = (
  user: Express.User,
  done: (error: unknown, value?: unknown) => void
) => {
  process.nextTick(() => {
    done(null, user);
  });
};

/**
 * @brief Deserializes the user from the session storage.
 *
 * This function retrieves the user's ID from the session, fetches the corresponding
 * user data from the database, and reconstructs the user object.
 *
 * @param id The ID of the user stored in the session.
 * @param done A callback function to indicate completion of the deserialization process.
 *
 * @note If `id` is `null`, the user is considered not logged in.
 * @throws 500 Internal Server Error if an error occurs while fetching user data.
 */
export const userDeserialisation = async (
  id: unknown, // id is acually the user passed down to this function if the user is logged in
  done: (error: null | unknown, value?: Express.User | boolean | null) => void
) => {
  if (id === null) {
    return done(null, false);
  }
  try {
    const userId = typeof id == 'object' && 'id' in id ? id : null;
    if (userId) {
      const fetchedUser = await User.findById(userId.id)
        .select({
          _id: true,
          fullname: true,
          email: true,
        })
        .lean()
        .exec();

      const user: Express.User | null = fetchedUser
        ? {
            id: fetchedUser._id,
            fullname: fetchedUser.fullname,
            email: fetchedUser.email,
          }
        : null;
      done(null, user);
    }
  } catch (err) {
    logger.error(err);
    done(err);
  }
};
