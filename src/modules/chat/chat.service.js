import { ChatModel } from "../../db/models/chat.model.js";
import { asyncHandler } from "../../utils/errors/async.handler.js";
import { successResponse } from "../../utils/success/success.response.js";


export const getChat = asyncHandler(async (req,res,next)=>{
    const {friendId} = req.params;

    const chat = await ChatModel.findOne({
        $or:[{
            mainUser:req.authUser._id,
            subParticipant: friendId
        },
        {
            mainUser:friendId,
            subParticipant: req.authUser._id
        }
    ]
    })
    .populate([
   {path:"mainUser", select:"firstName lastName image"},
   {path:"subParticipant", select:"firstName lastName image"},
   {path:"messages.senderId", select:"firstName lastName image"},

    ])

    successResponse({res, data:{chat}})
})