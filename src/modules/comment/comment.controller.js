import { Router } from "express";
import { authentication } from "../../middlewares/authentication.js";
import { authorization } from "../../middlewares/authorization.js";
import { roleTypes } from "../../db/models/user.model.js";
import * as commentService from "./comment.service.js"
import { fileValidations, uploadFileDisk } from "../../utils/fileUpoads/multer.js";
import { isValidate } from "../../middlewares/validation.js";
import * as commentValidation from "./coment.validation.js"
const router = Router({mergeParams: true})

router.post("/{:commentId}", 
    authentication,
    authorization([roleTypes.user]),
    uploadFileDisk("posts/comments", fileValidations.image).single("attachment"),
    isValidate(commentValidation.createcommentValidation),
    commentService.createComment
)
router.delete("/:commentId", 
    authentication,
    authorization([roleTypes.user]),
    commentService.deleteComment
)

router.patch("/:commentId", 
    authentication,
    authorization([roleTypes.user]),
    commentService.likeUnLike
)

router.put("/:commentId", 
    authentication,
    authorization([roleTypes.user]),
    commentService.updateComment
)
export default router