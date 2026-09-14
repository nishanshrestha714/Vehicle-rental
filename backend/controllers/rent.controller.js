
import mongoose from "mongoose";
import Vehicles from "../Models/vechile.model.js";
import rentVechile from "../Models/rent.model.js";
import Booking from "../Models/booking.vehicle.js";
import License from "../Models/license.model.js";

const addVehicleRent = async (req, res) => {
  try {
    // Get logged-in user ID
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        error: "Please login first",
      });
    }

    // Get data from request body
    const {
      vehicle,
      vehicleDetails,
      BookingTime,
      totalDays,
      pickuplocation,
      droplocation,
      payment,
    } = req.body;

    // Check required fields
    if (!vehicle) {
      return res.status(400).json({
        error: "Vehicle ID is required",
      });
    }

    if (!vehicleDetails?.bookingId) {
      return res.status(400).json({
        error: "Booking ID is required",
      });
    }

    if (!BookingTime?.start || !BookingTime?.end) {
      return res.status(400).json({
        error: "Booking start and end time are required",
      });
    }

    // Check vehicle ID
    if (!mongoose.Types.ObjectId.isValid(vehicle)) {
      return res.status(400).json({
        error: "Invalid vehicle ID",
      });
    }

    // Check booking ID
    if (!mongoose.Types.ObjectId.isValid(vehicleDetails.bookingId)) {
      return res.status(400).json({
        error: "Invalid booking ID",
      });
    }

    // Convert booking time to Date
    const startDate = new Date(BookingTime.start);
    const endDate = new Date(BookingTime.end);

    // Check valid dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        error: "Invalid booking date/time",
      });
    }

    // Check start time is before end time
    if (startDate >= endDate) {
      return res.status(400).json({
        error: "Start time must be before end time",
      });
    }

    // Find vehicle in database
    const targetVehicle = await Vehicles.findById(vehicle);

    if (!targetVehicle) {
      return res.status(404).json({
        error: "Vehicle not found",
      });
    }

    // Find booking in database
    const booking = await Booking.findById(vehicleDetails.bookingId);

    if (!booking) {
      return res.status(404).json({
        error: "Booking reference not found",
      });
    }

    // Check booking belongs to logged-in user
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        error: "You can only rent vehicles that you booked",
      });
    }

    // Find user's license
    const userlicense = await License.findOne({ user: userId });

    if (!userlicense) {
      return res.status(404).json({
        error: "License not found. Please add your license first",
      });
    }

    // Check license verification
    if (!userlicense.verified) {
      return res.status(400).json({
        error: "License is not verified. Please wait for verification",
      });
    }

    // Check vehicle category and license category if needed
    // if (userlicense.category !== targetVehicle.category) {
    //   return res.status(400).json({
    //     error: "Your license cannot be used for this vehicle",
    //   });
    // }

    // Check if vehicle is already rented during this time (overlap check)
    const isAlreadyRented = await rentVechile.findOne({
      vehicle: vehicle,
      "BookingTime.start": { $lt: endDate },
      "BookingTime.end": { $gt: startDate },
    });

    if (isAlreadyRented) {
      return res.status(400).json({
        error: "This vehicle is already rented during this time",
        existingBookingTime: isAlreadyRented.BookingTime,
      });
    }

    // Create new rental
    const newRent = await rentVechile.create({
      user: userId,
      vehicle: vehicle,
      license: userlicense._id,

      vehicleDetails: {
        bookingId: vehicleDetails.bookingId,
      },

      BookingTime: {
        start: startDate,
        end: endDate,
      },

      totalDays,
      pickuplocation,
      droplocation,
      paymentMethod: payment || "COD",
      isPaid: false,
    });

    // Send success response
    return res.status(201).json({
      message: "Vehicle rented successfully",
      rentalData: newRent,
    });
  } catch (error) {
    console.error("Add Vehicle Rent Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all rentals
const getAllRentals = async (req, res) => {
  try {
    const rentals = await rentVechile
      .find()
      .populate("vehicle", "name model -_id")
      .populate("user", "firstName lastName email phoneNumber -_id");

    // .find() returns [] when empty, never null/undefined — check length instead
    if (!rentals || rentals.length === 0) {
      return res.status(404).send({ error: "No rentals found!" });
    }

    res.status(200).send({ message: "Rentals list", rentals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get rent by id
const getrentalById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid rental ID" });
    }

    const rentalById = await rentVechile
      .findById(id)
      .populate("user", "email -_id")
      .populate("vehicle", "name model vehicleNumber");

    if (!rentalById)
      return res.status(404).send({ error: "Rental not found!" });

    res.status(200).json({ message: "Rental detail", rentalById });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update rental
const updateRental = async (req, res) => {
  try {
    const { BookingTime, totalDays, pickuplocation, droplocation } = req.body;
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Please login first" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Please enter a valid rental ID" });
    }

    const checkrental = await rentVechile.findById(id);
    if (!checkrental)
      return res.status(404).send({ error: "Rental vehicle not found" });

    // Ownership check — only the user who owns this rental can update it
    if (checkrental.user.toString() !== userId.toString()) {
      return res.status(403).json({
        error: "You can only update your own rental",
      });
    }

    checkrental.BookingTime = BookingTime || checkrental.BookingTime;
    checkrental.totalDays = totalDays || checkrental.totalDays;
    checkrental.pickuplocation = pickuplocation || checkrental.pickuplocation;
    checkrental.droplocation = droplocation || checkrental.droplocation;
    await checkrental.save();

    res.status(200).send({ message: "Rental updated", checkrental });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete rental
const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Please login first" });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .send({ error: "Rental ID is not valid, please try a valid id" });

    const rental = await rentVechile.findById(id);
    if (!rental)
      return res.status(404).send({ error: "This rental was not found" });

    // Ownership check — only the owner (or an admin) can delete it
    const isOwner = rental.user.toString() === userId.toString();
    const isAdmin = req.user?.isAdmin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "You are not authorized to delete this rental",
      });
    }

    await rental.deleteOne();

    res.status(200).send({ message: "Rental deleted" });
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