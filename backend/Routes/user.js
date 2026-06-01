import express from "express";
import { register,login, logout, searchMember } from "../Controllers/user.js";
import { auth } from "../Authentication/auth.js";
import upload from "../middleware/upload.js";
const router=express.Router();

// router.post("/register",register);
router.post("/login",login);
router.get("/searchedMember",auth,searchMember)
router.post("/logout",logout);

router.post(
  "/register",
  upload.single("profilePic"),
  register
);

export default router;