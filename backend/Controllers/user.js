import User from "../Models/user.js"
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../Config/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { name, mobileNumber, password } = req.body;

    const isExist = await User.findOne({ mobileNumber });

    if (isExist) {
      return res.status(409).json({
        error:
          "User with this number already registered. Try another number.",
      });
    }

    let profilePicUrl = "";

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const cloudinaryResponse = await cloudinary.uploader.upload(base64, {
        folder: "chat-app-profiles",
      });

      profilePicUrl = cloudinaryResponse.secure_url;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      mobileNumber,
      password: hashPassword,
        profilePic: profilePicUrl || undefined,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

const clientUrl = process.env.CLIENT_URL || "";
const isLocalhostClient = /localhost|127\.0\.0\.1/.test(clientUrl);
const isSecureCookie =
  process.env.NODE_ENV === "production" ||
  (clientUrl.startsWith("https://") && !isLocalhostClient);

const cookieOptions = {
  httpOnly: true,
  secure: isSecureCookie,
  sameSite: isSecureCookie ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login=async(req, res)=>{
 try{
    let {mobileNumber, password}=req.body;
    const  userExist=await User.findOne({mobileNumber});
    if(userExist&& await bcrypt.compare(password,userExist.password)){

     const token = jwt.sign(
  { userId: userExist._id },
process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
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
  const excludedUserIds = [req.user._id];

  if (process.env.AI_USER_ID) {
    excludedUserIds.push(process.env.AI_USER_ID);
  }

  const users = await User.find({
      $and: [
        { _id: { $nin: excludedUserIds } },
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

export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
    res.clearCookie('token', cookieOptions).json({ message: 'Logged out successfully' });
}
