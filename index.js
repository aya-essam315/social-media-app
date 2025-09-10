import express from "express"
import {config} from "dotenv"
import bootStrap from "./src/app.controller.js";
import connectDB from "./src/db/connection.js";
import {Server, Socket} from "socket.io"
import { authentication } from "./src/middlewares/socket/authentication.js";
import { connections } from "./src/db/models/user.model.js";
import { runIo } from "./src/modules/socket/socket.controller.js";
config()
const app = express();
const port = process.env.PORT || 3000;
bootStrap(app, express);

connectDB()
const httpServer = app.listen(port, ()=>{
    console.log(`Server is running on port ${port}🥳`);
})

runIo(httpServer)