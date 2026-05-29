import Conversation from "../Models/conversation.js";

export const ConversationRoom=async(req,res)=>{
   try{
     let senderId=req.user._id;
    let {recieverId}=req.body;
    let newConversation= new Conversation({
        members:[senderId,recieverId]
    })
    await newConversation.save();
    res.status(200).json({
        message:"Added Successfullly",
        conversation:newConversation
    })
}
 catch(err){
        console.log(err)
        res.status(500).json({error:"server error"})
    }
    
}

export const getConversation=async(req,res)=>{
try{
    let loggedinId=req.user._id;
    let conversations=await Conversation.find({
        members:{$in:[loggedinId]}
    }).populate("members", "-password");
      res.status(200).json({
        message:"feteched Successfullly",
        conversations
    })
}
 catch(err){
        console.log(err)
        res.status(500).json({error:"server error"})
    }
};