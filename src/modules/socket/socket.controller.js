
import { Server } from "socket.io";
import { logOut, registerSocket } from "./services/auth.service.js";
import { sendMessage } from "./services/messages.js";

export const runIo = async(httpServer)=>{
    

const io = new Server(httpServer, {cors:"*"});


io.on("connection", async(socket)=>{
    await registerSocket(socket)

    await sendMessage(socket)
     await logOut(socket)
    
  });
    

}