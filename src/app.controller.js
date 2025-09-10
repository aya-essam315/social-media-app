import authRouter from "./modules/auth/auth.controller.js"
import { globalError } from "./utils/errors/global.error.js";
import userRouter from "./modules/user/user.controller.js"
import postRouter from "./modules/post/post.controller.js"
import  chatRouter  from "./modules/chat/chat.controller.js";
import path from "path";
import cors from "cors"
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    legacyHeaders:false

})

const bootStrap = (app, express)=>{

    // app.use(limiter)
    app.use(express.json());
    app.use(cors("*"))
    app.use("/uploads", express.static(path.resolve("./src/uploads")))
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/post", postRouter)
    app.use("/chat", chatRouter)
    app.use(globalError);
    app.use( (req, res, next) => {
        res.status(404).json({ message: "page not found" });
    })
}

export default bootStrap;