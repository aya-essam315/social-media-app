
import jwt from "jsonwebtoken"

export const generateToken = ({payload={}, secreteKey=process.env.JWT_SECRET, options={}})=>{
    // console.log(secreteKey);
    
    // console.log(payload, secreteKey, options);
    
    return jwt.sign(payload, secreteKey, options )
   
    
}


export const verifyToken = ({token, secreteKey=process.env.JWT_SECRET})=>{
   try{
    console.log(token);
    
    return jwt.verify(token, secreteKey)
    // console.log(jwt.verify(token, secretKey));
    
   }catch(error){
    // return {error}
    console.log(error);
   }
}