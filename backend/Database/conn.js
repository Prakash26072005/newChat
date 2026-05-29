import mongoose from "mongoose";

mongoose.connect("mongodb+srv://pm2466599_db_user:pm@cluster0.i68udqr.mongodb.net/").then((response)=>{
    console.log("connected");
}).catch(err=>{
    console.log(err);
})