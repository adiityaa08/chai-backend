import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const userRouter=Router()

Router.route("/register").post(registerUser)

export default userRouter