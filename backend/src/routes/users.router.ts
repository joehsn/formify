import express from "express";
import * as UserController from "../controllers/users.controller";
import passport from "passport";

const router = express.Router();

router.post("/register", UserController.register);

router.post(
  "/login",
  passport.authenticate("local", {
    successMessage: "User logged in successfull",
    failureMessage: "Error occured while loggin in",
  }),
  UserController.login,
);

router.post("/logout", UserController.logout);

export default router;
