
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

/**
 * Complete rental — user le "Mark Complete" click garda:
 *  1. Booking fetch garcha ra ownership check garcha
 *  2. Tyo booking ko data bata ek naya `rentVechile` document CREATE garcha (database ma save)
 *  3. Booking.bookingStatus = true set garcha (status "completed" dekhinxa frontend ma)
 *
 * Body ma kehi extra pathauna chahiyena — booking document bata sabai data lincha.
 */
const completeRental = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Please login first" });
    }

    const { id } = req.params; // booking id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    // 1) Booking fetch + populate vehicle so we know the vehicle id
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isOwner = booking.user.toString() === userId.toString();
    const isAdmin = req.user?.isAdmin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "You are not authorized to complete this booking",
      });
    }

    if (booking.isCancelled) {
      return res.status(400).json({
        error: "Cancelled bookings cannot be marked as completed",
      });
    }

    if (booking.bookingStatus) {
      return res.status(400).json({
        error: "This booking is already marked as completed",
      });
    }

    // Vehicle id might be stored directly, or nested under vehicleId, depending on your Booking schema
    // const vehicleId = booking.vehicle?._id || booking.vehicle || booking.vehicleId;

    // if (!vehicleId) {
    //   return res.status(400).json({
    //     error: "Booking has no vehicle reference, cannot create rental",
    //   });
    // }
    const vehicleId = booking.vehicle?.vehicleId;

if (vehicleId) {
  const vehicle = await Vehicle.findById(vehicleId);
}


    const targetVehicle = await Vehicles.findById(vehicleId);
    if (!targetVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // 2) User's license (rental record requires a license reference)
    const userlicense = await License.findOne({ user: userId });
    if (!userlicense) {
      return res.status(404).json({
        error: "License not found. Please add your license first",
      });
    }

    if (!userlicense.verified) {
      return res.status(400).json({
        error: "License is not verified. Please wait for verification",
      });
    }

    // Pull dates/locations/payment off the booking document
    const startDate = new Date(booking.bookingPeriod?.start);
    const endDate = new Date(booking.bookingPeriod?.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        error: "Booking has invalid start/end date, cannot create rental",
      });
    }

    // Prevent duplicate rental record for the same booking
    const existingRentForBooking = await rentVechile.findOne({
      "vehicleDetails.bookingId": booking._id,
    });

    if (existingRentForBooking) {
      // Rental already exists — just make sure booking is marked complete and return it
      booking.bookingStatus = true;
      await booking.save();

      return res.status(200).json({
        message: "Booking already had a rental record — booking marked completed",
        rentalData: existingRentForBooking,
        booking,
      });
    }

    // 3) Create the rental record from booking data
    const newRent = await rentVechile.create({
      user: userId,
      vehicle: vehicleId,
      license: userlicense._id,

      vehicleDetails: {
        bookingId: booking._id,
      },

      BookingTime: {
        start: startDate,
        end: endDate,
      },

      totalDays: booking.totalDays,
      pickuplocation: booking.pickupLocation,
      droplocation: booking.dropLocation,
      paymentMethod: booking.payment?.method || "COD",
      isPaid: booking.payment?.isPaid || false,
    });

    // 4) Mark the booking as completed
    booking.bookingStatus = true;
    await booking.save();

    return res.status(200).json({
      message: "Rental marked as completed and saved",
      rentalData: newRent,
      booking,
    });
  } catch (err) {
    console.error("Complete Rental Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export {
  addVehicleRent,
  getAllRentals,
  getrentalById,
  updateRental,
  deleteRental,
  completeRental,
};