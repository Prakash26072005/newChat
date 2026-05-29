import jwt from "jsonwebtoken";
import User from "../Models/user.js";

export const auth= async(req,res,next)=>{
    const token= req.cookies.token;
    if(!token){
        return res.status(401).json({error:"No token, authorization denied"});
    }
    try{
        const decode= jwt.verify(token,"its-secret");
        let loginUserId=decode.userId;
        req.user=await User.findById(loginUserId).select("-password");
           if (!loginUserId) {
      return res.status(401).json({ error: "User not found" });
    }
        next();
    }
    catch(error){
        return res.status(401).json({error:"token is not valid"});
    }
}