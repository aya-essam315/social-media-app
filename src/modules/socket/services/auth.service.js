import { connections } from "../../../db/models/user.model.js";
import { authentication } from "../../../middlewares/socket/authentication.js";


export const registerSocket = async(socket)=>{
  const {data, valid} =  await authentication({socket})
  if(!valid){
   return socket.emit("socket_Error", data)
  }

  connections.set(data.user._id.toString(), socket.id)
  console.log(connections);
  
}

export const logOut = async(socket)=>{
return socket.on("disconnect", async()=>{
     const {data, valid} =  await authentication({socket})
  if(!valid){
   return socket.emit("socket_Error", data)
  }

  connections.delete(data.user._id.toString())

  return "done"
})
  
}