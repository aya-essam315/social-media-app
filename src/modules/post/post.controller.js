
import { Router } from "express";
import * as postServices from "./post.services.js"
import * as postValidation from "./post.validation.js"
import { authentication } from "../../middlewares/authentication.js";
import {authorization} from "../../middlewares/authorization.js"
import { roleTypes } from "../../db/models/user.model.js";
import { isValidate } from "../../middlewares/validation.js";
import { fileValidations, uploadFileDisk } from "../../utils/fileUpoads/multer.js";
import commentRouter from "../comment/comment.controller.js"
const router = Router();


router.use("/:postId/comment", commentRouter)

router.post("/",
    authentication,
    authorization([roleTypes.user]),
    uploadFileDisk("users/posts", fileValidations.image).array("attachment"),
    // fileValidations(),
 
    isValidate(postValidation.createPostValidation),
    // isValidate(postValidation.uploadImg),
    postServices.createPost
)
router.get("/",
    postServices.getPosts
)
router.patch("/:postId/like-unlike",
    authentication,
    authorization([roleTypes.user]),
    // isValidate(postValidation.freezePostValidation),
    postServices.likeUnLike
)

router.patch("/:postId",
    authentication,
    authorization([roleTypes.user]),
    uploadFileDisk("users/posts", fileValidations.image).array("attachment"),
    // fileValidations(),
 
    isValidate(postValidation.updateePostValidation),
    // isValidate(postValidation.uploadImg),
    postServices.updatePost
)

router.delete("/:postId",
    authentication,
    authorization([roleTypes.user]),
    isValidate(postValidation.freezePostValidation),
    postServices.freezePost
)

router.patch("/:postId/restore",
    authentication,
    authorization([roleTypes.user]),
    isValidate(postValidation.freezePostValidation),
    postServices.restorePost
)



export default router