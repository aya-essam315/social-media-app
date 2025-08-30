import { UserModel } from "../db/models/user.model.js";
import { asyncHandler } from "../utils/errors/async.handler.js";
import { verifyToken } from "../utils/security/token/token.js";


export const authentication = asyncHandler(
     async(req, res, next)=>{

        
        const {authorization} = req.headers;

        const [bearer, token] = authorization?.split(' ') || [];
  
        if(!bearer || !token){
                 return next(new Error("invalid authorization component.", {cause:401}))
        }
      //    let jwt_sign = "ss"

      //    switch (bearer) {
      //       case "admin":
      //           jwt_sign = process.env.JWT_SECRET_ADMIN
                
      //           break;
      //           case "bearer":
      //               jwt_sign = process.env.JWT_SECRET
      //           break;
      //           default:
      //           jwt_sign = process.env.JWT_SECRET

      //   }
        // console.log(jwt_sign);
        // if(bearer!== process.env.BEARER){
        //     // console.log("lll");
            
        //     return res.status(401).json({message: "invalid bearer token"});
        // }
        
        const {id, iat} = verifyToken({token, secreteKey:process.env.JWT_SECRET})
 
       
        
        
        if(!id){
           return next(new Error("invalid token.", {cause:401}))
        }
    

        const user = await UserModel.findById(id)
     
        if(!user){
                return next(new Error("user not found.", {cause:404}))
        }
           if(user.changeCredentialsTime?.getTime() >=  iat*1000 || user.isDeleted == true){
            return next(new Error("invalid credintioals .", {cause:400}))
           }

        req.authUser = user
  
        
        return next()


}
)
