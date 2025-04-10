import express, { Router } from "express";
import {loginUser, logOutUser, registerUser,refreshAccesstoken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = express.Router(); // ✅ correctly use express.Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
); // ✅ use the router instance, not the class

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT,  logOutUser)
router.route("refresh-token").post(refreshAccesstoken)
export default router;
