import express from "express";
import { auth } from "../Authentication/auth.js";
import { askAI } from "../Controllers/ai.js";

const router = express.Router();

router.post("/ask", auth, askAI);

export default router;