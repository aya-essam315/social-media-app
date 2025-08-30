import { PostModel } from "../../db/models/post.model.js";
import { defaultImage, roleTypes, UserModel } from "../../db/models/user.model.js";
import { emailEvent } from "../../utils/email/send.email.event.js";
import { asyncHandler } from "../../utils/errors/async.handler.js";
import { compareHashedData } from "../../utils/security/hashing/compare.js";
import { hashData } from "../../utils/security/hashing/hashing.js";
import { successResponse } from "../../utils/success/success.response.js";
import Randomstring from "randomstring";
import fs from "fs"
import path from "path"

export const getAll = asyncHandler(async(req,res,next)=>{
    const result = await Promise.all([
        UserModel.find(),
        PostModel.find()
    ])
    successResponse({res, data:result})
})

export const changeRole = asyncHandler(async(req,res,next)=>{
    const roles = req.authUser.role === roleTypes.superAdmin ?
     {role:{$nin:[roleTypes.superAdmin]}} :
      {role:{$nin:[roleTypes.admin, roleTypes.superAdmin]}}

    const {userId} = req.params;
    const {role} = req.body;
    const user = await UserModel.findOneAndUpdate(
        {_id:userId, ...roles},
        {role},
        {new:true}

    )


})



export const getProfile = asyncHandler(async(req,res,next)=>{

    const user = await UserModel.findById(req.authUser._id)
    .populate("viewers.userId")
    successResponse({res, data:{user}})
})

export const activateTwoStepVerification = asyncHandler(async(req,res,next)=>{
    const user = await UserModel.findById(req.authUser._id)

    user.twoStepVerification = !user.twoStepVerification
    await user.save()

    const message = user.twoStepVerification? "two step verification is active" : "two step verification is inactive"

    successResponse({res, message})
    
})


export const shareProfile = asyncHandler(async(req,res,next)=>{
    const {profileId} = req.params;
    // console.log("hiiiiiiiiiiiiiiiiiiii");
    
    // console.log(req.authUser._id.toString());
    
    let user = null
    if(profileId===req.authUser._id.toString()){
           console.log(req.authUser);
        
           user = req.authUser
    }else{
        user = await UserModel.findOne(
        {  _id:profileId, "viewers.userId": req.authUser._id },
   
        )
        if(user){
             const viewer = user.viewers.find(v => v.userId.equals(req.authUser._id));
        console.log(viewer.date.length);
        // return

        if(viewer.date.length==5 ){
            console.log(user);
            
            viewer.date.pop();
            viewer.date.push(new Date())
             await user.save()

        }else{
            viewer.date.push(new Date())
             await user.save()
        }
        }else{
           user = await UserModel.findOneAndUpdate(
        {  _id:profileId,  },  
        {$push:{viewers:{userId:req.authUser._id, date:new Date()}}} 
        )
        }

  
        
 return successResponse({res, data:user})
    }
    //   return successResponse({res, data:user})
})


export const updateEmail = asyncHandler(async(req,res,next)=>{
    const {email} = req.body;
    if(await UserModel.findOne({email})){
        return next(new Error("email is exists", {cause:409}))
    }
    
        const emailOTP = Randomstring.generate({length:6, charset:"numeric"});
        emailEvent.emit("sendConfirmEmail", {email:req.authUser.email, OTP:emailOTP});
        const hashedOtp = hashData({data:emailOTP})

     const tempEmailOTP = Randomstring.generate({length:6, charset:"numeric"});
        emailEvent.emit("sendConfirmTempEmail", {email, OTP:tempEmailOTP});
        const HashedempEmailOTP = hashData({data:tempEmailOTP})

    const user = await UserModel.findByIdAndUpdate(req.authUser._id,
        {
     
            tempEmail:email,
            tempEmailOtp:HashedempEmailOTP,
            confirmEmailOTP:hashedOtp
        
        }

    )
    return successResponse({res, message:"we sent code to verify ur email"})
})


export const resetEmail = asyncHandler(async (req,res,next)=>{
    const {oldCode, newCode} = req.body;
    console.log(req.authUser);
   
    console.log(compareHashedData({data:oldCode, hashedData:req.authUser.confirmEmailOTP}));
    console.log(compareHashedData({data:newCode, hashedData:req.authUser.tempEmailOtp}));
    
    

    if(!compareHashedData({data:oldCode, hashedData:req.authUser.confirmEmailOTP})
       || !compareHashedData({data:newCode, hashedData:req.authUser.tempEmailOtp})){
   
        return next(new Error("invalid otp", {cause:400}))
    }

 
const user = await UserModel.findByIdAndUpdate(
  req.authUser._id,  // id مباشرة
  {
    $set: {
      email: req.authUser.tempEmail,   
      changeCredentialsTime: new Date() 
    },
    $unset: {
      tempEmailOtp: 1,  
      tempEmail: 1,
      confirmEmailOTP: 1
    }
  },
  { new: true }  
);
    return successResponse({res, message:"email updated succcessfully"})
})


export const updatePassword = asyncHandler(async(req,res,next)=>{
    const {oldPassword, newPassword, cNewPassword} = req.body;
    const user = await UserModel.findByIdAndUpdate(
        req.authUser._id,
        {
            password: hashData({data:newPassword}),
            changeCredentialsTime:new Date()
        }
    )
    successResponse({res})
})


export const updateProfile = asyncHandler(async (req,res,next)=>{
    const user = await UserModel.findByIdAndUpdate(
        req.authUser._id,
        {
            ...req.body
        },
        {new:true}
    )
    successResponse({res, data:user})
})

export const updateProfilePic = asyncHandler(async (req,res,next)=>{

   console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
   
    
    const user = await UserModel.findByIdAndUpdate(
        req.authUser._id,
        {
           image: req.file.finalPath
        },
        {new:true}
    )
    successResponse({res, message:"pic uploaded succcessfully",data:user})
})


export const updateCoverPic = asyncHandler(async (req,res,next)=>{

// console.log({hhhhhhhhhhhhhhh:req.files});

    const user = await UserModel.findByIdAndUpdate(
        req.authUser._id,
        {$push:
          { coverImages: req.files.map(file=>file.finalPath)}
        },
        {new:true}
    )
    successResponse({res, message:"pic uploaded succcessfully",data:user})
})


export const deleteProfilePic = asyncHandler(async(req,res,next)=>{
    

    const user = req.authUser
  
  const imgPath = path.join(path.resolve(), "src", user.image);

if (fs.existsSync(imgPath)) {
  fs.unlinkSync(imgPath);
  console.log(" Deleted:", imgPath);
} else {
  console.log(" File not found:", imgPath);
}

user.image = defaultImage
    await user.save()
    // console.log(user);
    successResponse({res, message:"pic deleted succcessfully",data:user})
    
})


export const addToBlockList = asyncHandler(async(req,res,next)=>{
    const {userId} = req.params
    const user = await UserModel.findOne({_id:userId, isDeleted:false})
    if(!user){
        return next(new Error("user not found", {cause:404}))
    }
    const prof  = await UserModel.findById(req.authUser._id)
    // if(!req.authUser.blockList.includes(user._id)){
    //    prof.blockList.push(user._id)
    //    await prof.save()
    // }
    console.log(user);
    

    if(prof.blockList.length>0){
         const getIndex = prof.blockList.findIndex(id=> id.toString() === userId.toString())
    console.log(getIndex);
    if(getIndex == -1){
       prof.blockList.push(user._id)
        await prof.save()
    }else{
        prof.blockList.splice(getIndex, 1)
       await  prof.save()
    }
    }else{
         prof.blockList.push(user._id)
        await prof.save()
    }
    successResponse({res})


})