import express from "express";
import cookieParser from "cookie-parser";
import "./Database/conn.js"; 
import UserRoutes from "./Routes/user.js";
import ConversationRoutes from "./Routes/conversation.js"
import MessageRoutes from "./Routes/message.js"
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

const app = express();
const PORT =  8000;

app.use(express.json());
app.use(cookieParser());
dotenv.config();

const server=http.createServer(app)

const io= new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
  }
})

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
  origin:"http://localhost:5173"
}))

app.use("/api/auth",UserRoutes);
app.use("/api/conversation",ConversationRoutes)
app.use("/api/chat",MessageRoutes)

 server.listen(PORT,()=>{
    console.log(`listening on port:${PORT}`);
 })