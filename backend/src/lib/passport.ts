import LocalStrategy from "passport-local";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import logger from "../utils/logger";
import createHttpError from "http-errors";

export const strategy = new LocalStrategy.Strategy(
  {
    usernameField: "email",
    passReqToCallback: true,
  },
  async function (req, email, password, done) {
    if (req.isAuthenticated()) {
      return done(null, false, {
        message: "You need to log out first",
      });
    }
    try {
      const user = await User.findOne({ email })
        .select("+password")
        .lean()
        .exec();

      if (!user) {
        return done(null, false, { message: "User does not exists" });
      }

      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return done(null, false, { message: "Invalid credinatials" });
      }

      return done(null, {
        id: user._id,
        email: user.email,
      });
    } catch (error) {
      logger.error(error);
      return done(createHttpError(500, `${error}`));
    }
  },
);

export const userSerialisation = (
  user: Express.User,
  done: (error: unknown, value?: unknown) => void,
) => {
  process.nextTick(() => {
    done(null, user);
  });
};

export const userDeserialisation = async (
  id: unknown, // id is acually the user passed down to this function if the user is logged in
  done: (error: null | unknown, value?: Express.User | boolean | null) => void,
) => {
  if (id === null) {
    return done(null, false);
  }
  try {
    const userId = typeof id == "object" && "id" in id ? id : null;
    if (userId) {
      const fetchedUser = await User.findById(userId.id)
        .select({
          _id: true,
          email: true,
        })
        .lean()
        .exec();

      const user: Express.User | null = fetchedUser
        ? {
            id: fetchedUser._id,
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
