import {Router} from "express";
import {registerUser} from "../controller/user.controller.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        },
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)


export default router;