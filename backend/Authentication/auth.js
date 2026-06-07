import jwt from "jsonwebtoken";
import User from "../Models/user.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const loginUserId = decode?.userId;

    if (!loginUserId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const user = await User.findById(loginUserId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token", { path: "/" });
    return res.status(401).json({ error: "Token is not valid or has expired" });
  }
};