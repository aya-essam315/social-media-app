import { UserModel } from "../../db/models/user.model.js";
import { asyncHandler } from "../../utils/errors/async.handler.js";
import { verifyToken } from "../../utils/security/token/token.js";


export const authentication =   async({socket={}})=>{

        
      //   const {authorization} = req.headers;

      //   console.log( {socket});
        

        const [bearer, token] = socket?.handshake?.auth?.authorization?.split(' ') || [];
  
        if(!bearer || !token){
                 return {data: {message:"invalid authorization component.", status:401}}
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
          
            return {data: {message:"invalid token.", status:401}}
        }
    

        const user = await UserModel.findById(id)
     
        if(!user){
           
            return {data: {message:"user not found.", status:404}}

        }
           if(user.changeCredentialsTime?.getTime() >=  iat*1000 || user.isDeleted == true){
                       return {data: {message:"invalid credintioals.", status:400}}

           }

     return {data: {message:"done", user}, valid:true}
  
        
   


}

