import { Router } from "express";
import * as userServices from "./user.service.js"
import {authentication} from "../../middlewares/authentication.js"
import { isValidate } from "../../middlewares/validation.js";
import * as userValidation from "./user.validation.js"
import { fileValidations, uploadFileDisk } from "../../utils/fileUpoads/multer.js";
import { authorization } from "../../middlewares/authorization.js";
import { roleTypes } from "../../db/models/user.model.js";
const router = Router({
   strict:true,
   caseSensitive:true
});

router.get("/gat-all",
          authentication,
          authorization([roleTypes.admin, roleTypes.superAdmin]),
          userServices.getAll
)

router.get("/change-role",
          authentication,
          authorization([roleTypes.admin, roleTypes.superAdmin]),
          userServices.changeRole
)

router.patch("/profile/add-friend/:friendId", authentication, userServices.addFriend)
router.patch("/profile/accept/:friendRequestId", authentication, userServices.acceptFriendRequet)

router.get("/profile",
     authentication,
     isValidate(userValidation.idValidation),
    userServices.getProfile);
router.patch("/activate-two-step-verification",
      authentication,
     userServices.activateTwoStepVerification)
router.get("/share-profile/:profileId",
       authentication,
       userServices.shareProfile);

router.patch("/update-email",
    authentication,
    isValidate(userValidation.updateEmailValidation),
    userServices.updateEmail
 )
router.patch("/reset-email",
    authentication,
    isValidate(userValidation.verifyVodes),
    userServices.resetEmail
 )
 router.patch("/change-password",
    authentication,
    isValidate(userValidation.updatePasswordValidation),
    userServices.updatePassword
 )

 router.patch("/update-password",
    authentication,
    isValidate(userValidation.updatePasswordValidation),
    userServices.updatePassword
 )

  router.patch("/update-profile",
    authentication,
    isValidate(userValidation.upateProfile),
    userServices.updateProfile
 )

 
  router.patch("/update-profile-pic",
    authentication,
    uploadFileDisk("users/profile", fileValidations.image).single("attachment"),
    isValidate(userValidation.uploadProfileImg),
    userServices.updateProfilePic
 )


  router.delete("/delete-profile-pic",
    authentication,
    userServices.deleteProfilePic
 )

   router.patch("/update-cover-pic",
    authentication,
    uploadFileDisk(`users/cover`, fileValidations.image).array("attachment"),
   isValidate(userValidation.uploadProfileImg),
    userServices.updateCoverPic
 )

   router.patch("/block-list/:userId",
    authentication,
    userServices.addToBlockList
 )

export default router;
