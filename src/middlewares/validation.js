
import joi from "joi";

export const isValidate=(schema)=>{
    return (req,res,next)=>{
            // console.log(req.body);
            // console.log({gggggggggggg:req.body});
            
        
        const data = {...req.body, ...req.params, ...req.query}

   
        
        if(req.file || req.files?.length){
            data.file = req.file || req.files
        }

        // console.log({data:data.file});
        
    
   
        const result = schema.validate(data, {abortEarly: false})

         if(result.error) {
        let messages = result.error.details.map((ele)=> ele.message )
        return next(new Error(messages, {cause:400}))
    }

    return next();
        
    }
}

