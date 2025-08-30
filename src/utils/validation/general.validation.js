import joi from "joi";
import { Types } from "mongoose";
import { genderTypes } from "../../db/models/user.model.js";


const validateObjectId = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error("invalid"); 
  }
  return value;
};

const fileUpload = {
    
      fieldname: joi.valid("attachment"),
      originalname: joi.string(),
      encoding: joi.string(),
      mimetype:joi.string(),
      finalPath: joi.string(),
      destination:joi.string(),
      filename:joi.string(),
      path: joi.string(),
      size:joi.number(),
    
}
export const generalFields = {
    userName : joi.string().min(2).max(50),
    email : joi.string().email(),
   password: joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .messages({
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number."
  }),

    cPassword:joi.string().valid(joi.ref('password')),
    objectId: joi.custom(validateObjectId),
    phone: joi.string(),
    address: joi.string(),
    gender: joi.string().valid(...Object.values(genderTypes)),
    fileUpload,
    file: joi.object(fileUpload)
}




