
import { Router } from "express";
import { authentication } from "../../middlewares/authentication.js";
import * as chatService from "./chat.service.js"
const router = new Router()

router.get("/:friendId", authentication, chatService.getChat)



export default router