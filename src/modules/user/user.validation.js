import joi from "joi"
import { generalFields } from "../../utils/validation/general.validation.js"

export const idValidation = joi.object({
profileId: generalFields.objectId
}).required()


export const updateEmailValidation = joi.object({
    email:generalFields.email.required()
}).required();



export const verifyVodes = joi.object({
  oldCode:joi.string().required(),
  newCode:joi.string().required(),
}).required();


export const updatePasswordValidation = joi.object({
  oldPassword: joi.string(),
  newPassword: generalFields.password.not(joi.ref("oldPassword")).message("new password is the same old one"),
  cNewPassword: joi.valid(joi.ref("newPassword"))

}).required()


export const upateProfile = joi.object({
  userName: generalFields.userName,
  gender: generalFields.gender,
  address: generalFields.address,
  phone: generalFields.phone,

})


export const uploadProfileImg = joi.object({
  file: generalFields.file.required()
})

