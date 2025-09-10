
import { model, Schema, Types } from "mongoose";


const chatSchema = new Schema({
    mainUser:{type:Types.ObjectId, ref:"User", required:true},
    subParticipant:{type:Types.ObjectId, ref:"User", required:true},
    messages:[
     {   message:String,
        senderId:{type:Types.ObjectId, ref:"User", required:true},}
    ]
},{timestamps:true})


export const ChatModel = model("Chat", chatSchema)