import express from "express"
import {config} from "dotenv"
import bootStrap from "./src/app.controller.js";
import connectDB from "./src/db/connection.js";
config()
const app = express();
const port = process.env.PORT || 3000;
bootStrap(app, express);

connectDB()
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}🥳`);
})