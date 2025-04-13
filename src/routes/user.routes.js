import express, { Router } from "express";
import {loginUser, logOutUser, registerUser,refreshAccesstoken,changeuserpassword,getcurrentuser,
        updateuserdetails,updateuseravatar,updateusercoverimage,getuserchannelprofile,getwatchHistory} 
from "../controllers/user.controller.js";


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
router.route("/change-password").post(verifyJWT, changeuserpassword)
router.route("/current-user").get(verifyJWT, getcurrentuser)
router.route("/update-account").patch(verifyJWT, updateuserdetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateuseravatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateusercoverimage)

router.route("/c/:username").get(verifyJWT, getuserchannelprofile)
router.route("/history").get(verifyJWT, getwatchHistory)
export default router;
