import multer from "multer"
import path from "path";
import fs from "fs"
export const fileValidations = {
    image: ["image/png", "image/jpeg", "image/jpg"],
    doc:["application/pdf"]
}

let basePath;
// function setBasePath(value){

// }
export const uploadFileDisk = (
    customPath = "general",
    fileValidation = []
)=>{

    // console.log(55555555555555555555555);
    

    // let customPath;

         
    const storage = multer.diskStorage({
        destination: (req,file,cb)=>{
            // console.log(req.baseUrl);
            
            // if(req.baseUrl.includes("comment")){
            //     customPath = "posts/comments"
            // }
            basePath = `uploads/${customPath}/${req.authUser._id}`
            const fullPath = path.resolve(`./src/${basePath}`)
            // console.log({fullPath});
            if(!fs.existsSync(fullPath)){
                fs.mkdirSync(fullPath, {recursive:true})

            }
  console.log("hi from multer");
          
            
            cb(null, fullPath)
        },
        filename: (req,file,cb)=>{
            // console.log({file});
            
       const finalName =  Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname
    //    const finalPath = basePath + "/" + finalName;
       file.finalPath = basePath + "/" + finalName;
    //    console.log(file);
       
        cb(null,finalName)

        }
    })
    function fileFilter(req,file,cb){
        if(fileValidation.includes(file.mimetype)){
              cb(null, true)
        }else{
            // console.log("invalid");
            
             cb("invalid file", false)
        }
    }


    return multer({fileFilter, storage})
}