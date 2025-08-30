import { asyncHandler } from "../../utils/errors/async.handler.js";
import {provider, UserModel} from "../../db/models/user.model.js"
import Randomstring from "randomstring";
import {emailEvent}  from "../../utils//email/send.email.event.js"
import { hashData } from "../../utils/security/hashing/hashing.js";
import {successResponse} from "../../utils/success/success.response.js"
import {compareHashedData} from "../../utils/security/hashing/compare.js"
import {generateToken} from "../../utils/security/token/token.js"
import {OAuth2Client} from 'google-auth-library';
export const signUp = asyncHandler(async(req,res,next)=>{
    const {userName, email, password, cPassword} = req.body;
    // console.log("ok");
    //check if email exists
    const user = await UserModel.findOne({email});
    if(user){
        return res.status(400).json({message:"Email already exists"});
        }


    const OTP = Randomstring.generate({length:6, charset:"numeric"});
    emailEvent.emit("sendConfirmEmail", {email, OTP});

    const hashedPassword = hashData({data:password})
    const hashedOtp = hashData({data:OTP})
    const createdUser = await UserModel.create({
        userName,
        email,
        password:hashedPassword,
        confirmEmailOTP:hashedOtp

    })
    return successResponse({res, statusCode:201, message:"User created successfully, pls confirm ur email"})

})


export const confirmEmial = asyncHandler(async(req,res,next)=>{
    const {email, OTP} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not found"});
        }
        if(compareHashedData({data:OTP, hashedData:user.confirmEmailOTP})){
            user.confirmEmail=true
            await user.save()
            return successResponse({res, message:"email confirmed successfully, u can login"})
        }
        return next(new Error("invalid otp", {cause:409}))
})



export const login = asyncHandler(async (req,res, next)=>{
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        return next(new Error("user not found", {cause:404}))
    }

 
    const isMatch = compareHashedData({data:password, hashedData:user.password})
    if(!isMatch){
          return next(new Error("invalid credintials", {cause:409}))

    }
    if(!user.confirmEmail){
             return next(new Error("please confirm ur email first"))

    }
       if(user.twoStepVerification){
        const twoStepVer = Randomstring.generate({length:6, charset:"numeric"})
        emailEvent.emit("2-step-verification-code", {email, OTP: twoStepVer})
        user.twoStepVerificationCode = hashData({data:twoStepVer})
        user.save()
        successResponse({res, message:`otp sent to ${email}`})
    }

    const access_token = generateToken({
        payload:{id:user._id},
    })
     const refresh_token = generateToken({
        payload:{id:user._id},
        options:{
            expiresIn: 31536000 
        }
    })
    return successResponse({res, message:"logged in successfullly", data:{access_token, refresh_token}})
})

export const twoStepVerificationLogin = asyncHandler(async(req,res,next)=>{
    const {email, OTP} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        return next(new Error("no such user email", {cause:404}))
    }
    if(!compareHashedData({data:OTP, hashedData: user.twoStepVerificationCode})){
         return next(new Error("invalid otp", {cause:409}))
    }
  const access_token = generateToken({
        payload:{id:user._id},
    })
     const refresh_token = generateToken({
        payload:{id:user._id},
        options:{
            expiresIn: 31536000 
        }
    })
    return successResponse({res, message:"logged in successfullly", data:{access_token, refresh_token}})
})


export const forgetPassword = asyncHandler(async (req,res, next)=>{
    const {email} = req.body;
    const user = await UserModel.findOne({email, isDeleted:false, confirmEmail:true});
    if(!user){
        return next(new Error("user not found", {cause:404}))
        }
    const OTP = Randomstring.generate({length:6, charset:"numeric", });
  
    // console.log(user);
    
    user.resetPasswordOtp.otp = hashData({data:OTP})
     user.resetPasswordOtp.expiresAt = new Date()
    await user.save()
  emailEvent.emit("resetPassword", {email, OTP});
    return successResponse({res, message:"we sent otp to reset password"})
})






   let attempts = 0;
export const changePassword = asyncHandler(async (req,res,next)=>{
 
    let timer;

    if(attempts <= 5){
        attempts ++;
        const {email, OTP,newPassword, cNewPassword} = req.body;
    const user = await UserModel.findOne({email, isDeleted:false});
    if(!user){
        return next(new Error("user not found", {cause:404}))
        }

        if(((new Date()-user.resetPasswordOtp.expiresAt)/1000/60)>=2){

          return next(new Error("otp expired", {cause:400}))

 }
 const isMatch = compareHashedData({data:OTP, hashedData:user.resetPasswordOtp.otp})

 if(!isMatch){

 return next(new Error("invalid otp", {cause:400}))

 }
        user.password = hashData({data:newPassword})
        user.changeCredentialsTime = Date.now();
        user.save();
        return successResponse({res, message:"password changed successfully"})  
    }

else {
     setTimeout(() => {
        attempts = 0
}, 300000);
    return next(new Error("too many attempts, banned for 5 mins", {cause:429}))
}
    
    
})


const client = new OAuth2Client();
async function verify(idToken) {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,  
  });
 return ticket.getPayload();
   



//   const userid = payload['sub'];
//   // If the request specified a Google Workspace domain:
//   // const domain = payload['hd'];
}

export const loginWithGoogle = asyncHandler(async (req,res,next)=>{
  const  {idToken} = req.body;

const {email, name, picture} = await verify(idToken);
let user = await UserModel.findOne({email, isDeleted:false});
if(!user){
     user = await UserModel.create({
        userName:name,
        email,
        image:picture,
        provider:provider.google,
        confirmEmail:true
    })
       const access_token = generateToken({
        payload:{id:user._id},
    })
     const refresh_token = generateToken({
        payload:{id:user._id},
        options:{
            expiresIn: 31536000 
        }
    })
    return successResponse({res, message:"logged in successfullly", data:{access_token, refresh_token}})
}
if(user.provider===provider.google){
    const access_token = generateToken({
        payload:{id:user._id},
    })
     const refresh_token = generateToken({
        payload:{id:user._id},
        options:{
            expiresIn: 31536000 
        }
    })
    return successResponse({res, message:"logged in successfullly", data:{access_token, refresh_token}})
}

return next(new Error("User already exists", {cause:409}))
}


)