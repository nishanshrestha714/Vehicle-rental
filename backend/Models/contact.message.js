import mongoose from "mongoose";
const  constactMessageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        match:/^\+977\d{10}$/
    },
    message:{
        type:String,
        required:true
    },

    
},{timestamps:true});

const ContactMessage = mongoose.model("ContactMessage",constactMessageSchema);
export default ContactMessage;