import Conversation from "../Models/conversation.js";

export const ConversationRoom=async(req,res)=>{
   try{
     let senderId=req.user._id;
    let {recieverId}=req.body;

     const existingConversation =
      await Conversation.findOne({
        members: {
          $all: [senderId, recieverId]
        }
      });

    if (existingConversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        conversation: existingConversation
      });
    }
    
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
    const membersQuery = {
        $in:[loggedinId]
    };

    if (process.env.AI_USER_ID) {
        membersQuery.$nin = [process.env.AI_USER_ID];
    }

    let conversations=await Conversation.find({
        members: membersQuery
    }).populate("members", "-password")
    .sort({ updatedAt: -1 });
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
