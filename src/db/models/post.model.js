

import { Schema, Types, model } from "mongoose";
import { commentModel } from "./comment.js";

const postSchema = new Schema({
    text: {type:String, required: function(){
       return  this.attachment?.length? false: true
    }, maxlength: 10000},
    attachment:[String],
    createdBy:{type: Types.ObjectId, ref:"User", required:true},
    updatedBy:{type: Types.ObjectId, ref:"User", },
    deletedBy:{type: Types.ObjectId, ref:"User",},
    likes:[{type: Types.ObjectId, ref:"User"}],
    tags:[{type: Types.ObjectId, ref:"User"}],
    isDeleted:Boolean
},{timestamps:true})

postSchema.virtual("comments", {
  
    localField:"_id",
    foreignField:"postId",
      ref:"Comment",
      justOne:true
})

postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });




postSchema.pre("deleteOne",{document:true, query:false},async function(next, doc){
  
    let cursor = commentModel.find({postId:this._id}).cursor()
   
// ;
    for(let comment = await cursor.next(); comment!=null; comment = await cursor.next()){
        const comments = await commentModel.findOneAndDelete({postId:this._id})
 
    }
    
})





export const PostModel = model("Post", postSchema)