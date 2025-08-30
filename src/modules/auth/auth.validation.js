import joi from "joi";
import {generalFields} from "../../utils/validation/general.validation.js"
export const signUpValidation = joi.object({
    userName:generalFields.userName.required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    cPassword:generalFields.cPassword.required(),
    
}).required()


export const forgetPasswordValidation = joi.object({

    OTP:joi.string(),
    email:generalFields.email.required(),
    newPassword:generalFields.password.required(),
    cNewPassword:joi.string().valid(joi.ref('newPassword'))
    
}).required()