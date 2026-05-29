import express from "express";
import { auth } from "../Authentication/auth.js";
import { getMessage, sendMessage } from "../Controllers/message.js";

const router= express.Router();
 
router.post("/post-message-chat",auth,sendMessage) 
router.get("/get-message-chat/:convId",auth,getMessage)

export default router;