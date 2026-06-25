import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Userdata"
    },
    // ReviewVehicle:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true,
    //     ref:"Vehiclelist"
    // },

    title:{

        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true

    },
    rating:{
        type:Number,
        default:0,
        min:0,
        max:5
    }
})
export default reviewSchema;
