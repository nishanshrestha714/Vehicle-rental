import mongoose from "mongoose";
import Vehicles from "../Models/vechile.model.js";
import rentVechile from "../Models/rent.model.js";
import Booking from "../Models/booking.vehicle.js";
import License from "../Models/license.model.js";
const addVehicleRent = async (req, res) => {
  try {
    // user login and find
    const userId = req.user._id;
    if (!userId)
      return res
        .status(401)
        .json({ error: "user not login please login  and try again" });
    // destructure
    const {
      License,
      vehicle,
      vehicleDetails,
      BookingTime,
      totalDays,
      pickuplocation,
      droplocation,
      payment,
    } = req.body;

    // check the vechle id  and vehicle find the vehicle database
    if (!mongoose.Types.ObjectId.isValid(vehicle)) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }
    // and so check the vechile booking database in booking id to perticular user booking
    if (!mongoose.Types.ObjectId.isValid(vehicleDetails.bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    // check db vehiclelist in db
    const targetVehicle = await Vehicles.findById(vehicle);
    if (!targetVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const booking = await Booking.findById(vehicleDetails.bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking reference not found" });
    }

    // check in the license verify in  isAdmin  true  ot not

    const userlicense = await License.findOne({ user: userId });
    if (!userlicense) {
      return res
        .status(404)
        .json({ error: "License not found, please add your license first!" });
    }

    if (!userlicense.verified) {
      return res
        .status(400)
        .json({
          error: "License is not verified, please wait for verification!",
        });
    }
    //check license category and vehicle category match or not

    // and so perticular user vehicle book and rent sucess

    const isAlreadyRented = await rentVechile.findOne({ vehicle });
    if (isAlreadyRented) {
      return res
        .status(400)
        .json({
          error: "This vehicle is already rented",
          "BookingTime.start": BookingTime.end,
          "BookingTime.end": BookingTime.start,
        });
    }
    // booking.user le booked gareko vehicle ko user id ho  and current userId check  login user id ho  check garne
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        error: "You can only rent vehicles that you booked",
      });
    }

    // and license verify or not check in this

    const newRent = await rentVechile.create({
      user: req.user._id,
      vehicle,
      license,
      vehicleDetails,
      BookingTime,
      totalDays,
      pickuplocation,
      droplocation,
      payment,
    });

    res.status(201).json({
      message: "Vehicle added to rent successfully",
      rantaldata: newRent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// and get all vehicle rent

const getAllRentals = async (req, res) => {
  try {
    const rentals = await rentVechile
      .find()
      .populate("vehicle", "name model -_id")
      .populate("user", "firstName lastName email phoneNumber -_id");
    if (!rentals) {
      return res.status(404).send({ error: "rentals vehicle are not found!" });
    }
    res.status(200).send({ message: "rentals vehicle ...", rentals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get rent by id

const getrentalById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(id);
      return res.status(400).json({ error: "Invalid rental ID" });
    }
    const rentalById = await rentVechile
      .findById(id)
      .populate("user", "email -_id")
      .populate("vehicle", "name model vehicleNumber");

    if (!rentalById)
      return res.status(404).send({ error: "you are not rent  for vehicle!" });

    res.status(200).json({ message: "you  rent vehicle list ..", rentalById });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//and update this rentals
const updateRental = async (req, res) => {
  try {
    // update in key  find req.body

    const { BookingTime, totalDays, pickuplocation, droplocation } = req.body;
    const { id } = req.params;
    // user find in update rental
    const userId = req.user._id;
    // and check the rental id valid ro nor valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({ errr: "please valid rental ID  inter" });
    }
    // check this rental vehicle
    const checkrental = await rentVechile.findById(id);
    if (!checkrental)
      return res.status(404).send({ error: "not found rental vechile" });

    checkrental.BookingTime = BookingTime || checkrental.BookingTime;
    checkrental.totalDays = totalDays || checkrental.totalDays;
    checkrental.pickuplocation = pickuplocation || checkrental.pickuplocation;
    checkrental.droplocation = droplocation || checkrental.droplocation;
    await checkrental.save();

    res.send({ message: "update rental", checkrental });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// delete rental

const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(404)
        .send({ error: " rental id not  valid please try valid id" });

    const deleterent = await rentVechile.findByIdAndDelete(id);
    if (!deleterent)
      return res
        .status(404)
        .send({ error: "this rental not found in the database" });

    res.status(200).send({ message: "delete this rental" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addVehicleRent,
  getAllRentals,
  getrentalById,
  updateRental,
  deleteRental,
};
