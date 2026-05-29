import Message from "../Models/message.js";

export const sendMessage=async(req,res)=>{
    try{
    let {conversation, content}= req.body;
    let addMessage=new Message({sender:req.user._id,conversation,message:content});
    await addMessage.save();
    let populatedMessage=await addMessage.populate("sender")
     res.status(201).json({message:populatedMessage})
    }
        catch(err){
        console.log(err)
        res.status(500).json({error:"server error"})
    }
}

export const getMessage=async(req,res)=>{
    try{
   const {convId}= req.params;
   let message=await Message.find({
    conversation:convId
   }).populate("sender")
        res.status(200).json({messages:"messsage fectched successfully",message})
    }
     catch(err){
        console.log(err)
        res.status(500).json({error:"server error"})
    }
}