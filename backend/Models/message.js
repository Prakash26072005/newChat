import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message: {
        type:String,
        required:true
    }
},{timestamps:true});

export default mongoose.model("Message", MessageSchema);
