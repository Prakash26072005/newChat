import express from "express";
import { register,login, logout, searchMember } from "../Controllers/user.js";
import { auth } from "../Authentication/auth.js";

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/searchedMember",auth,searchMember)
router.post("/logout",logout);

export default router;