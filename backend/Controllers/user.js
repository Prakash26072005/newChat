import User from "../Models/user.js"
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
export const register=async(req,
  res)=>{
    try{
let {name, mobileNumber, password, profilePic}=req.body;
 const isExist=await User.findOne({mobileNumber})
 if (isExist){
    return res.status(409).json({error:"user with this number already already registerd. try with another number"})
 };

 const hashPassword=await bcrypt.hash(password,10);
 const newUser=new User({name, mobileNumber, password:hashPassword, profilePic});
 
 await newUser.save();
 return res.status(200).json({
    message:"user registered successfully",
    newUser,
 })
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"server error"})
    }
}


const cookieOptions={
    httpOnly:true,
    secure:false,
    sameSite:"Lax"
};

export const login=async(req, res)=>{
 try{
    let {mobileNumber, password}=req.body;
    const  userExist=await User.findOne({mobileNumber});
    if(userExist&& await bcrypt.compare(password,userExist.password)){

        const token=jwt.sign({userId:userExist._id},"its-secret");
       res.cookie("token",token,cookieOptions);

        res.status(200).json({
            message:"login successfully",
            user:userExist
        })

    }else{
        res.status(400).json({error:"Invalid credentials"});
    }
 }
 catch(err){
    console.log(err)
       res.status(500).json({error:"server error"})
 }
}


 export const searchMember=async(req,res)=>{
    try{
  let {queryParam}= req.query;
  const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            {
              name: {
                $regex: new RegExp(`^${queryParam}`, "i"),
              },
            },
            {
              mobileNumber: {
                $regex: new RegExp(`^${queryParam}`, "i"),
              },
            },
          ],
        },
      ],
    });
    res.status(200).json(users);
    }
    
 catch(err){
    console.log(err)
       res.status(500).json({error:"server error"})
 }
 }

export const logout = async (req, res) => {
    res.clearCookie('token', cookieOptions).json({ message: 'Logged out successfully' });
}