
import { commentModel } from "../../db/models/comment.js";
import { PostModel } from "../../db/models/post.model.js";
import { roleTypes, UserModel } from "../../db/models/user.model.js";
import { asyncHandler } from "../../utils/errors/async.handler.js";
import { successResponse } from "../../utils/success/success.response.js";
import { pagination } from "../../utils/pagination.js";


export const createPost = asyncHandler(async (req,res,next)=>{
    const {text} = req.body;
   let attachment = req.files.map(file=>file.finalPath)
    const post = await PostModel.create({
        text,
       attachment,
       createdBy: req.authUser._id
    })

    successResponse({res, message:"post created", data:post})
})

export const getPosts = asyncHandler(async (req,res,next)=>{


    const {page, size} = req.query;
    console.log({page, size});
    
    const data = await pagination({model:PostModel,
         filter:{isDeleted:{$exists:false}},
          populate:[
        {path:"createdBy", select:"userName image"},
         {path:"likes", select:"userName image"},
         {path:"comments",
         match:{commentId:{$exists:false}},
         populate:{path:"replys", options: { strictPopulate: false }, }}
       ],
       page,
       size
    })
    // const posts = await PostModel.find({isDeleted:{$exists:false}})
    // .populate([

    //     {path:"createdBy", select:"userName image"},
    //      {path:"likes", select:"userName image"},
    //      {path:"comments",
    //      match:{commentId:{$exists:false}},
    //      populate:{path:"replys", options: { strictPopulate: false }, }
       
    //         },
                

       

    // ])
//     let result = []
//     let cursor = PostModel.find({}).cursor()
   
// ;
//     for(let post = await cursor.next(); post!=null; post = await cursor.next()){
//         const comments = await commentModel.find({postId:post._id})
//         result.push({post, comments})
//     }
    

    successResponse({res, message:"post created", data:data})
})

export const updatePost = asyncHandler(async (req,res,next)=>{
    const {text} = req.body;
   let attachment = req.files.map(file=>file.finalPath)
    const post = await PostModel.findOneAndUpdate(
        {_id:req.params.postId,  createdBy: req.authUser._id, isDeleted:{$exists:false}},
        {
        text,
       attachment,
      
    },
    {new:true}
)

    return post? successResponse({res, message:"post updated", data:post}):
                 next(new Error("post not found", {cause:404}))
})


export const freezePost = asyncHandler(async(req,res,next)=>{
    console.log(req.authUser._id);
    console.log(req.params.postId);
    // console.log(await UserModel.findOne(id:req.params.postId));
    // return
    
    
    const owner = req.authUser.role === roleTypes.admin? {} : {createdBy: req.authUser._id}
    const post = await PostModel.findOneAndUpdate({
        _id:req.params.postId,
         isDeleted:{$exists:false},
         ...owner

    },
    {isDeleted:true,
        updatedBy:req.authUser._id,
        deletedBy:req.authUser._id
    },
    {new: true}
)

    return post? successResponse({res, message:"post deleted", data:post}):
                 next(new Error("post not found", {cause:404}))
})



export const restorePost = asyncHandler(async(req,res,next)=>{
   console.log(req.params.postId);
   
    const post = await PostModel.findOneAndUpdate({
        _id:req.params.postId,
         isDeleted:true,
         deletedBy:req.authUser._id


    },
    {$unset:{
        isDeleted:0,
  
        deletedBy:0
    }},
    {
        updatedBy:req.authUser._id,

    },
    {new: true}
)

    return post? successResponse({res, message:"post restord", data:post}):
                 next(new Error("post not found", {cause:404}))
})


export const likeUnLike = asyncHandler(async(req,res,next)=>{
    // console.log("kkkkkkkkkkkkkkkk");
    
    const post = await PostModel.findOne(
             {_id:req.params.postId,  isDeleted:{$exists:false}},
    );
    console.log(post);
    
    const getIndex = post.likes.findIndex(id=> id.toString() === req.authUser._id.toString())
    console.log(getIndex);
    if(getIndex == -1){
        post.likes.push(req.authUser._id)
        await post.save()
    }else{
        post.likes.splice(getIndex, 1)
       await  post.save()
    }
  return   successResponse({res, data:post})
    
})