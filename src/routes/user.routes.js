import express from "express";
import { registerUser } from "../controllers/user.controller.js";

const userRouter = express.Router(); // ✅ correctly use express.Router()

userRouter.route("/register").post(registerUser); // ✅ use the router instance, not the class

export default userRouter;
