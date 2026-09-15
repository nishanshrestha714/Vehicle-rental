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
  phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        // Allows 10-digit numbers (like 9810309878) or international numbers (+977...)
        validator: function (v) {
          return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    message:{
        type:String,
        required:true
    },

    
},{timestamps:true});

const ContactMessage = mongoose.model("ContactMessage",constactMessageSchema);
export default ContactMessage;