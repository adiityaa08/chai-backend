import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const userRouter = express.Router(); // ✅ correctly use express.Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxcount:1
        },
        {
            name:"coverimage",
            maxcount:1
        }
    ]),
    registerUser
); // ✅ use the router instance, not the class

export default userRouter;
