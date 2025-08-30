import joi from "joi";
import { generalFields } from "../../utils/validation/general.validation.js";

export const createPostValidation = joi.object({
    text: joi.string().max(10000),
    file: joi.array().items(generalFields.file)
})

export const updateePostValidation = joi.object({
    postId:generalFields.objectId.required(),
    text: joi.string().max(10000),
    file: joi.array().items(generalFields.file)
})
// export const uploadImg = joi.object({
//   file: generalFields.file
// })
// .or("text", "attachment")


export const freezePostValidation = joi.object({
    postId:generalFields.objectId.required(),

})