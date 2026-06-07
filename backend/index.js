import dotenv from "dotenv";
import AIRoutes from "./Routes/ai.js";
import express from "express";
import cookieParser from "cookie-parser";
import "./Database/conn.js"; 
import UserRoutes from "./Routes/user.js";
import ConversationRoutes from "./Routes/conversation.js"
import MessageRoutes from "./Routes/message.js"
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());


const server=http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection",(socket)=>{
  console.log("user connected");

  socket.on("joinConversation",(conversationId)=>{
    console.log(`user joined Conversation Id Of ${conversationId}`);
    socket.join(conversationId);
  });

   socket.on("sendMessage",(convId,messageDetails)=>{
    console.log("message sent");
       
    io.to(convId).emit("receiveMessage", messageDetails)
   })

  socket.on("disconnect",()=>{
    console.log("user disconnected");
  });
});

app.use(cors({
  credentials:true,
origin: process.env.CLIENT_URL
}))

app.use("/api/auth",UserRoutes);
app.use("/api/conversation",ConversationRoutes)
app.use("/api/chat",MessageRoutes)
app.use("/api/ai", AIRoutes);

 server.listen(PORT,()=>{
    console.log(`listening on port:${PORT}`);
 })