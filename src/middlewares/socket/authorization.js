

export const authorization = (accessRoles=[])=>{
    return (req, res, next) =>{

        
     try {
           if(!accessRoles.includes(req.authUser.role)){
                  return next(new Error("not authorized.", {cause:403}))
        }
     return   next();
        
     } catch (error) {
        
        
     }
    }
    
}