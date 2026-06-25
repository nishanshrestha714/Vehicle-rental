import mongoose from "mongoose";

const rentVehicles = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Userdata"
    },
    vehicle:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Vehicles"
    },
    license:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"license"
    },


    vehicleDetails:{
        bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Booking",
              },
              // name: {
              //   type: String,
              //   ref: "Vehicles",
              // },
              // image: {
              //   type: String,
              //   default: "sample image.jpg",
              // },
              // rentPerHours: {
              //   type: Number,
              //   required: true,
              // },
              // calcPerPrice: {
              //   type: Number,
              //   required: true,
              // },
              // totalperHourPrice: {
              //   type: Number,
              //   required: true,
              // },
              // location: {
              //   type: String,
              //   required: true,
              // },
 
    },
    BookingTime: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    
    totalDays: {
      type: Number,
      required: true,
    },
    pickuplocation: {
      type: String,
      required: true,
    },
    droplocation: {
      type: String,
    },

     paymentMethod: {
      type: String,
      default: "COD",
    },
    idPaid: {
      type: Boolean,
      default: false,
    },
    PaidAt: {
      type: Date,
    },
    

},{timestamps:true});
const rentVechile = mongoose.model("rentVechile",rentVehicles)

export default rentVechile;

// so this rental model 