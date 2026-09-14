
// this is  my booking  controllers
import mongoose from "mongoose";
import Booking from "../Models/booking.vehicle.js";
import nagarikta from "../Models/nagarikta.model.js";
// import License from "../Models/license.model.js";
import LicenseModel from "../Models/license.model.js";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
// import Booking from "../Models/booking.vehicle.js";

const id = uuidv4();
console.log( "this is uuid ",id);

const addBooking = async (req, res) => {
  try {
    const {
      vehicle,
      bookingPeriod,
      totalDays,
      totalPrice,
      pickupLocation,
      dropLocation,
      nagariktaId,
      // bookingStatus intentionally NOT taken from req.body — always starts false.
      License,
      payment,
    } = req.body;

    const userId = req.user._id;
    console.log("userId", userId);
    console.log("req.body", req.body);
    console.log("REQ BODY =>", JSON.stringify(req.body, null, 2));

    // Check nagarikta exists
    const userNagarikta = await nagarikta.findOne({ user: userId });
    if (!userNagarikta) {
      return res.status(400).json({
        error: "Please add your Nagarikta first before booking a vehicle.",
      });
    }
    const userLicense = await LicenseModel.findOne({ user: userId });
    if (!userLicense) {
      return res.status(400).json({ error: "Please add your license first." });
    }

    // Validate booking period
    const startTime = new Date(bookingPeriod.start);
    const endTime = new Date(bookingPeriod.end);

    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(400).json({ error: "Invalid booking dates!" });
    }
    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ error: "Return date must be after pickup date!" });
    }

    // Check duplicate/overlapping booking for same vehicle
    const checkBook = await Booking.findOne({
      "vehicle.vehicleId": vehicle.vehicleId,
      isCancelled: false,
      $and: [
        { "bookingPeriod.start": { $lt: endTime } },
        { "bookingPeriod.end": { $gt: startTime } },
      ],
    });
    if (checkBook) {
      return res.status(409).json({
        error: "This vehicle is already booked for the selected dates!",
      });
    }

    // Create booking — bookingStatus/isCancelled always start at their
    // defaults (false); never trust these from the client.
    const booking = await Booking.create({
      user: userId,
      nagariktaId,
      License,
      vehicle,
      bookingPeriod: { start: startTime, end: endTime },
      totalDays,
      totalPrice,
      pickupLocation,
      dropLocation,
      payment: {
        method: payment?.method || "COD",
      },
    });

    res
      .status(201)
      .json({ message: "Booking added successfully!", bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// and view all order in admin only for
const getAllBooking = async (req, res) => {
  try {
    const AllBookingDetails = await Booking.find()
      .populate("user", "firstName lastName email -_id")
      .populate("vehicle.vehicleId", "name vehicleNumber image -_id");

    if (!AllBookingDetails || AllBookingDetails.length === 0) {
      return res.status(404).json({ error: "No bookings found!" });
    }

    res.status(200).json({ message: "All booking details", AllBookingDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get booking by id for user
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookingId = await Booking.findById(id)
      .populate("user", "firstName lastName email -_id")
      .populate("vehicle.vehicleId", "name vehicleNumber image -_id");

    if (!bookingId) {
      return res.status(404).json({ error: "Booking not found!" });
    }

    res.status(200).json({ message: "Booking details", bookingId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get my booking details
const getMyBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const MyBooking = await Booking.find({ user: userId }).populate(
      "vehicle.vehicleId",
      "name vehicleNumber image -_id",
    );

    if (!MyBooking || MyBooking.length === 0) {
      return res.status(404).json({ error: "You have no bookings yet!" });
    }

    res.status(200).json({ message: "Your bookings", MyBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a booking (dates / pickup / drop location) — user can only edit their own
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { bookingPeriod, pickupLocation, dropLocation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found!" });
    }

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only update your own booking" });
    }

    // Don't allow edits once the booking is finalized (completed or cancelled)
    if (booking.isCancelled || booking.bookingStatus) {
      return res.status(400).json({ error: "This booking can no longer be edited" });
    }

    let startTime = booking.bookingPeriod.start;
    let endTime = booking.bookingPeriod.end;

    if (bookingPeriod?.start && bookingPeriod?.end) {
      startTime = new Date(bookingPeriod.start);
      endTime = new Date(bookingPeriod.end);

      if (isNaN(startTime) || isNaN(endTime)) {
        return res.status(400).json({ error: "Invalid booking dates!" });
      }
      if (startTime >= endTime) {
        return res.status(400).json({ error: "Return date must be after pickup date!" });
      }

      const overlapping = await Booking.findOne({
        _id: { $ne: booking._id },
        "vehicle.vehicleId": booking.vehicle.vehicleId,
        isCancelled: false,
        $and: [
          { "bookingPeriod.start": { $lt: endTime } },
          { "bookingPeriod.end": { $gt: startTime } },
        ],
      });

      if (overlapping) {
        return res.status(400).json({
          error: "This vehicle is already booked for the selected dates",
        });
      }
    }

    booking.bookingPeriod = { start: startTime, end: endTime };
    booking.pickupLocation = pickupLocation || booking.pickupLocation;
    booking.dropLocation = dropLocation || booking.dropLocation;

    await booking.save();

    res.status(200).json({ message: "Booking updated successfully!", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a booking — user can only cancel their own, before it's finalized
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found!" });
    }

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only cancel your own booking" });
    }

    if (booking.isCancelled || booking.bookingStatus) {
      return res.status(400).json({ error: "This booking can't be cancelled" });
    }

    booking.isCancelled = true;
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully!", booking });
  } catch (err) {
    // next(err);
    res.status(500).json({ error: err.message });
  }
};

// booking completed to delete this booking list
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found!" });
    }

    res.status(200).json({ message: "Booking deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    const transaction_uuid = `${booking._id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const message = `total_amount=${booking.totalPrice},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;

    const signature = crypto
      .createHmac("sha256", "8gBm/:&EnhH.1/q")
      .update(message)
      .digest("base64");

    const details = {
      amount: booking.totalPrice,
      total_amount: booking.totalPrice,
      transaction_uuid,
      product_code: "EPAYTEST",
      tax_amount: 0,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: "http://localhost:8001/api/booking/confirm-payment",
      failure_url: `http://localhost:5173/booking/${booking._id}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    };

    console.log("Payment Details:", details);

    return res.status(200).json({
      success: true,
      details,
    });
  } catch (error) {
    console.error("Payment Details Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// confirm Payment
const ComfirmPayment = async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.status(400).json({ message: "Missing eSewa data" });
    }
    const { status, transaction_uuid } = JSON.parse(
      Buffer.from(data, 'base64').toString('utf-8')
    );
    console.log( ' this is data ', data);

    if (status == 'COMPLETE') {
      const bookingId = transaction_uuid.split('-')[0];

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      console.log("Booking Found:", booking);

      booking.payment.isPaid = true;
      booking.payment.paidAt = Date.now();
      await booking.save();

      return res.redirect(`http://localhost:5173/bookingdetails/${bookingId}`);
    }

    return res.json(status);
  } catch (error) {
    console.error("CONFIRM PAYMENT ERROR:", error);

    return res.status(500).json({
      message: 'Payment confirmation failed',
      error: error.message,
      stack: error.stack
    });
  }
};

const BookingComplete = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.bookingStatus = true;
    booking.bookingStatusAt = new Date();
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking completed successfully",
      booking,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  addBooking,
  getAllBooking,
  getBookingById,
  getMyBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
  getPaymentDetails,
  ComfirmPayment,
  BookingComplete
};