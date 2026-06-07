import jwt from "jsonwebtoken";
import User from "../Models/user.js";

export const auth= async(req,res,next)=>{
    const token= req.cookies.token;
    if(!token){
        return res.status(401).json({error:"No token, authorization denied"});
    }
    try{
       const decode = jwt.verify(
  token,
  process.env.JWT_SECRET
);
        const loginUserId = decode.userId;
        const user = await User.findById(loginUserId).select("-password");

        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({error:"token is not valid"});
    }
}