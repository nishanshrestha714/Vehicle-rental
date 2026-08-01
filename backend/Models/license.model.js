// import mongoose
import mongoose from "mongoose";
import nagarikta from "./nagarikta.model.js";

const licenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Userdata",
    },
    licesneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\d{2}-\d{2}-\d{8}$/,
        "License number must be in format: 12-34-56789012",
      ],
      // example: 12-34-56789012
    },
    fullname: {
      type: String,
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
    },

    cotegory: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D"],
    },
    image: {
      type: String,
      // required: true,
      // default: "license.png",
      //
      required: [true, "License image is required"],
    },
    nagariktaNumber: {
      type: String,
      required: true,
    },
    nagarikta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nagarikta",
    },

    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    }, 
  },
  { timestamps: true },
);

const License = mongoose.model("License", licenseSchema);

export default License;

// const License = mongoose.models?.License || mongoose.model('License', licenseSchema)
// module.exports = License;
