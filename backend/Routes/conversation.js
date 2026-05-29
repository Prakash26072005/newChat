import express from "express";
import { ConversationRoom,getConversation } from "../Controllers/conversation.js";
import { auth } from "../Authentication/auth.js";

const router=express.Router();

router.post("/add-conversation",auth,ConversationRoom);
router.get("/get-conversation",auth,getConversation);

export default router;