import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import nagarikta from "./nagarikta.model.js";

const UserSchema= new mongoose.Schema({
     firstName:{
        type:String,
        requried:true,
        minlength:3,
        maxlength:20,
        trim:true
    },
    lastName:{
         type:String,
        requried:true,
        minlength:4,
        maxlength:20,
        trim:true
    },
    email:{
        type:String,
        requried:true,
        unique:true,

    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true,
        //  match:/^\d{10}$/ // Validates a 10-digit phone number
        //accepts both: 9812345303 or +9779812345303

            match: [/^(\+977)?[0-9]{10}$/, "Please enter a valid Nepal phone number"]

    },
    
    password:{
        type:String,
        required :true,

       },
       image:{
        type:String,
        default:"./image/sample.jpg"
       },


       isAdmin:{
        type:Boolean,
        default:false,

       },
       otp:{
        type:String,
        default:null,// so enpty for otp stack or undifind

       }, 
       optexpires:{
        type:Date,
        default:null,

       },
       isverified:{
        type:Boolean,// so opt verified for success for true 
        default :false
       },
       resetopt:{
        type:String,
        deafault:'',

       },
       resetOtpExpire:{
        type :Number,
        default:0
       },

       adderss:{
        type:String,
         minlength:4,
         maxlength:20,
    
       },
       city:{
        type:String,
         minlength:4,
         maxlength:20,
    
       },

       nagarik:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'nagarikta'
       }


}, {timestamps:true});

// so name set for user databse
UserSchema.virtual('name').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// password hashing function add 


UserSchema.pre("save",async function(next){
    // if password will be not change into returun in this 
    if(!this.isModified('password')){
         return;
    }
     // so password hashing in bcyrptjs using 
const salt=await bcrypt.genSalt(10);
this.password =await bcrypt.hash(this.password,salt);
});

// so password hashing compare 
UserSchema.methods.comparePassword  =async function(enterPassword){
if (!enterPassword ){
    throw new Error ("you are missing passsword  arguments!")
};


return await bcrypt.compare(enterPassword , this.password);
 // if string contition 
   //return await bcrypt.compare(String(password ), this.password);

};



// check for userdata in mongodb 
const Userdata =mongoose.models.Userdata ||  mongoose.model("Userdata",UserSchema);

export default Userdata;
