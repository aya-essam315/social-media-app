import { Socket } from "socket.io";
import { authentication } from "../../../middlewares/socket/authentication.js";
import { ChatModel } from "../../../db/models/chat.model.js";
import { connections } from "../../../db/models/user.model.js";


export const sendMessage = async(socket)=>{

     const {data, valid} =  await authentication({socket})
    //  console.log({data});
     
      if(!valid){
       return socket.emit("socket_Error", data)
      }

  socket.on("sendMessage", async (messageData) => {
  const userId = data.user._id;
  const { message, destId } = messageData;

  let chat = await ChatModel.findOneAndUpdate(
    {
      $or: [
        { mainUser: userId, subParticipant: destId },
        { mainUser: destId, subParticipant: userId }
      ]
    },
    { $push: { messages: { message, senderId: userId } } },
    { new: true }
  ).populate([
    { path: "mainUser", select: "firstName lastName image" },
    { path: "subParticipant", select: "firstName lastName image" },
    { path: "messages.senderId", select: "firstName lastName image" }
  ]);

  if (!chat) {
    chat = await ChatModel.create({
      mainUser: userId,
      subParticipant: destId,
      messages: [{ message, senderId: userId }]
    });
  }


  socket.emit("successMessage", { chat, message });


  const destSocketId = connections.get(destId);
  if (destSocketId) {
    socket.to(destSocketId).emit("receiveMessage", { chat, message });
  }
});

    

return "done"
        
  
}