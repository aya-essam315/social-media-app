

import { Schema, Types, model } from "mongoose";

const commentSchema = new Schema({
    text: {type:String, required: function(){
       return  this.attachment?.length? false: true
    }, maxlength: 10000},
    attachment:String,
    postId:{type: Types.ObjectId, ref:"Post", required:true},
    commentId:{type: Types.ObjectId, ref:"Comment"},
    createdBy:{type: Types.ObjectId, ref:"User", required:true},
    updatedBy:{type: Types.ObjectId, ref:"User", },
    deletedBy:{type: Types.ObjectId, ref:"User",},
    likes:[{type: Types.ObjectId, ref:"User"}],
    tags:[{type: Types.ObjectId, ref:"User"}],
    isDeleted:Boolean
},{timestamps:true, toJSON:{virtuals:true}, toObject:{virtuals:true}})

commentSchema.virtual("replys", {
    ref:"Comment",
    localField:"_id",
    foreignField:"commentId"
})

commentSchema.set("toObject", { virtuals: true });
commentSchema.set("toJSON", { virtuals: true });



commentSchema.pre("deleteOne",{document:true, query:false},async function(next, doc){
  
    let cursor = commentModel.find({commentId:this._id}).cursor()
   
// ;
    for(let comment = await cursor.next(); comment!=null; comment = await cursor.next()){
        const comments = await commentModel.findOneAndDelete({commentId:this._id})
 
    }
    
})



export const commentModel = model("Comment", commentSchema)