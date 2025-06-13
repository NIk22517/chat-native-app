import { Elysia } from "elysia";
import authRouter from "./auth.routes";
import conversationsRouter from "./conversations.routes";
import messageRouter from "./messages.routes";
import userRouter from "./user.routes";

const rootRoter = new Elysia();

rootRoter.use(authRouter);
rootRoter.use(conversationsRouter);
rootRoter.use(messageRouter);
rootRoter.use(userRouter);

export default rootRoter;
