import { Response, Request } from "express";
import userRegisterSchema from "../lib/schemas/register";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import logger from "../utils/logger";
import createHttpError from "http-errors";
import { hashPass } from "../utils";
import User from "../models/user.model";

export async function register(req: Request, res: Response) {
  try {
    const data = userRegisterSchema.parse(req.body);
    const hashed = await hashPass(data.password);

    const isUserExists = await User.findOne({
      email: data.email,
    });

    if (isUserExists) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }

    const user = new User({ ...data, password: hashed });
    await user.save();
    res.status(200).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const fromError = fromZodError(error);
      logger.error(
        "An error occurred while parsing user registeration data",
        fromError,
      );
      throw createHttpError(500, fromError);
    }
    logger.error("An error occurred while registering a new user: " + error);
    throw createHttpError(
      500,
      "An error occured while registering a new user: " + error,
    );
  }
}

export function login(req: Request, res: Response) {
  res.status(200).json({ message: "Login successful!", user: req.user });
}

export function logout(req: Request, res: Response) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Unauthorized: Please log in." });
    return;
  }
  req.logout((error) => {
    if (error) {
      logger.error(error);
      res.status(500).json({
        message: "An error occured while logging the user out",
      });
      return;
    }
    res.status(200).json({
      message: "User logged out successfully",
    });
  });
}
