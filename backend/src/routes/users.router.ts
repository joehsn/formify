import express from "express";
import * as UserController from "../controllers/users.controller";
import passport from "passport";

const router = express.Router();

router.get("/", UserController.getUser);

// TODO:
// router.put("/", UserController.updateUser);

// TODO:
// router.delete("/", UserController.deleteUser);

router.post("/register", UserController.register);

router.post("/login", passport.authenticate("local"), UserController.login);

router.post("/logout", UserController.logout);

export default router;
