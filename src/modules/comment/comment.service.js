import { Types } from "mongoose";
import { commentModel } from "../../db/models/comment.js";
import { PostModel } from "../../db/models/post.model.js";
import { roleTypes } from "../../db/models/user.model.js";
import { asyncHandler } from "../../utils/errors/async.handler.js";
import { successResponse } from "../../utils/success/success.response.js";
import path from "path"
import fs from "fs"

export const createComment = asyncHandler(async (req,res,next)=>{
     const {postId, commentId} = req.params
     const {text} = req.body;
     
    const post = await PostModel.findOne({id:postId});
        if(post){
            return next(new Error("post not found", {cause:404}))
        }
     
     if(commentId){
        if(await commentModel.findOne({_id:commentId, isDeleted:{$exists:false}})){

     const comment = await commentModel.create(
     {  text,
       attachment: req.file.finalPath,
       createdBy: req.authUser._id,
       postId:postId,
       commentId
    }
        )
    
       return successResponse({res, message:"comment created", data:comment})
     }else{
        return next(new Error("comment not found", {cause:404}))
     }
    }
    
 

        const comment = await commentModel.create(
     {  text,
       attachment:req.file.finalPath,
       createdBy: req.authUser._id,
       postId:postId
    }
        )
    
        successResponse({res, message:"comment created", data:comment})
})


    // const owner = req.authUser.role === roleTypes.admin? {} : {createdBy: req.}
export const updateComment = asyncHandler(async (req,res,next)=>{

    const {text} = req.body;
 if(req.files?.length>0){
           attachment = req.files.map(file=>file.finalPath)
     }
    const post = await commentModel.findOneAndUpdate(
        {_id:req.params.commentId,  createdBy: req.authUser._id, isDeleted:{$exists:false}},
        {
        text,
       attachment,
      
    },
    {new:true}
)

    return post? successResponse({res, message:"comment updated", data:post}):
                 next(new Error("comment not found", {cause:404}))
})



export const deleteComment = asyncHandler(async(req,res,next)=>{
    const {commentId} = req.params;

    const comment = await commentModel.findOne({_id:commentId, isDeleted:{$exists:false}})
        if(comment.attachment){
          const imgPath = path.join(path.resolve(), "src", comment.attachment);
        
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
          console.log(" Deleted:", imgPath);
        } else {
          console.log(" File not found:", imgPath);
        }
    }
    await comment.deleteOne()

    successResponse({res, message:"coment deleted succcessfully"})
})



export const likeUnLike = asyncHandler(async(req,res,next)=>{
    // console.log("kkkkkkkkkkkkkkkk");
    
    const comment = await commentModel.findOne(
             {_id:req.params.commentId,  isDeleted:{$exists:false}},
    );

    
    const getIndex = post.likes.findIndex(id=> id.toString() === req.authUser._id.toString())
    console.log(getIndex);
    if(getIndex == -1){
        comment.likes.push(req.authUser._id)
        await comment.save()
    }else{
        comment.likes.splice(getIndex, 1)
       await  comment.save()
    }
  return   successResponse({res, data:comment})
    
})