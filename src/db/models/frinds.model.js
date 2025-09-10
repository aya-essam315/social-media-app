
import { Schema, Types, model } from "mongoose";


const frindRequestSchema = new Schema({
    friendId:{type:Types.ObjectId, ref:"User", required:true},
    createdBy:{type:Types.ObjectId, ref:"User", required:true},
    status:{type:Boolean, default:false}
},{timestamps:true})


export const FriendRequestModel = model("frindRequest", frindRequestSchema)