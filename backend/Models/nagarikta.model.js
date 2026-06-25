//  import { image } from "framer-motion/client";
import mongoose from "mongoose";

const nagariktaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Userdata",
    },

    // vehicleId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true,
    //     ref:"Vehicles"
    // },

    nagariktaNumber: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\d{2}-\d{2}-\d{2}-\d{5,7}$/,
        "Please fill a valid Nagarikta number format",
      ],

      //12-34-56-78901
    },
    fullName: {
      type: String,
      required: true,
    },
    dateofBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
      // match: /^\d{4}-\d{2}-\d{2}$/,
      // type: Date,        //  Mongoose stores this as a JavaScript Date object
      //match: /^\d{4}-\d{2}-\d{2}$/,  // this checks STRING pattern

      //   trim: true,
    },
    permentAddress: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    issueDistrict: {
      type: String,
      required: true,
      trim: true,
    },

    frontImage: {
      type: String,
      // required:true,
      required: [true, "Front image is required"],
    },

    backImage: {
      type: String,
      // required:true,
      required: [true, "Back image is required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userdata",
    },
  },
  { timestamps: true },
);
const Nagarikta = mongoose.model("Nagarikta", nagariktaSchema);
export default Nagarikta;
