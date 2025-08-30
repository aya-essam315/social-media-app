import { generalFields } from "../../utils/validation/general.validation.js"
import joi from "joi"
export const createcommentValidation = joi.object({
   postId:generalFields.objectId.required(),
    commentId:generalFields.objectId,
    text: joi.string().max(10000),
    file: generalFields.file
})

export const updateecommentValidation = joi.object({
    commentId:generalFields.objectId.required(),
    text: joi.string().max(10000),
    file: joi.array().items(generalFields.file)
})



export const freezecommentValidation = joi.object({
    commentId:generalFields.objectId.required(),

})