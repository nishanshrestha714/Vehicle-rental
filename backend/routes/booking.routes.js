import {
  addBooking,
  deleteBooking,
  getAllBooking,
  getBookingById,
  getMyBooking,
  getPaymentDetails,
  ComfirmPayment,
  BookingComplete,
  cancelBooking,
  updateBooking
} from "../controllers/booking.controller.js";
import express from "express";
import checkAuth from "../middleware/checkAuth.middleware.js";
import checkAdmin from "../middleware/checkAdmin.middleware.js";

const router = express.Router();
router.post("/", checkAuth, addBooking);
router.get("/", checkAuth, checkAdmin, getAllBooking);
router.get("/mybooking", checkAuth, getMyBooking);
router.get("/confirm-payment" , ComfirmPayment);
router.get("/:id", checkAuth, getBookingById);
router.get("/:id/get-payment-details"  ,checkAuth,getPaymentDetails);
router.delete("/:id/delete", checkAdmin, deleteBooking);
router.put("/:id/bookingConfirm", checkAuth,checkAdmin , BookingComplete);
router.put("/:id/updated" , checkAuth , checkAdmin,updateBooking);
// router.put("/:id/cancel" , checkAuth , cancelBooking);




export default router;



