
import mongoose from "mongoose";
// import nagarikta from "./nagarikta.model.js";


const BookingVehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Userdata",
    },
    nagariktaId:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"Nagarikta",
    },
    License:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"License"
    },

    vehicle: {
      vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Vehicles",
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        default: "sample_image.jpg",
      },
      pricePerDay: {
        type: Number,
        required: true,
      },
      seats: {
        type: Number,
        default: 2,
      },
      location: {
        type: String,
        required: true,
      },
    },

    bookingPeriod: {
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
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },


    dropLocation: {
      type: String,
      required: true,
      trim: true,
    },

    bookingStatus: {
      type: Boolean,
        default: false,
    },
    bookingStatusAt:{
      type:Date,
    },

    payment: {
      method: {
        type: String,
        enum: ["COD", "Khalti", "eSewa", "Bank"],
        default: "COD",
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      paidAt: {
        type: Date,
      },
      transactionId: {
        type: String,
        default: null,
      },
    },

    identification: {
      docType: {
        type: String,
        enum: ["citizenship", "passport", "license"],
        default: "citizenship",
      },
      docImage: {
        type: String,
        default: null,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },

    cancelReason: {
      type: String,
      default: null,
    },
  },

  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingVehicleSchema);

export default Booking;


