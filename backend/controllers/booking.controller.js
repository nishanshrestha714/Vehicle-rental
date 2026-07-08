// this is  my booking  controllers 
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
      bookingStatus,
      License,
      payment,
    } = req.body;

    const userId = req.user._id;
    console.log("userId", userId);
    console.log("req.body", req.body);
    console.log("REQ BODY =>", JSON.stringify(req.body, null, 2));
    
 

    // Check nagarikta exists
    //  Check if user has added Nagarikta
    const userNagarikta = await nagarikta.findOne({ user: userId });
    if (!userNagarikta) {
      return res.status(400).json({
        error: "Please add your Nagarikta first before booking a vehicle.",
      });
    }
    //  license check and exits
    const userLicense = await LicenseModel.findOne({ user: userId });
    if (!userLicense) {
      return res.status(400).json({ error: "Please add your license first." });
    }

    //  // Check nagarikta verified
    // if (!userNagarikta.verified) {
    //   return res.status(400).json({
    //     error: "Nagarikta not verified! Please wait for admin verification.",
    //   });
    // }

    //  // in citizen verify in the code add in  this 

    // if (!req.file){
    //   return 
    //    res.status(400).json({error:"this image is erquired!"});
    // };



    // Validate booking period
    const startTime = new Date(bookingPeriod.start);
    const endTime = new Date(bookingPeriod.end);
    //     if (startTime >= endTime) {
//       return res.status(400).json({ error: "Invalid booking time range" });
//     }

    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(400).json({ error: "Invalid booking dates!" });
    }
    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ error: "Return date must be after pickup date!" });
    }

    // Check duplicate booking for same vehicle and overlapping time
    const checkBook = await Booking.findOne({
      "vehicle.vehicleId": vehicle.vehicleId,
      user: userId,
      $and: [
        { "bookingPeriod.start": { $lt: endTime } },
        { "bookingPeriod.end": { $gt: startTime } },
      ],
    });
    // if (checkBook) {
    //   return res.status(409).json({
    //     error: "You already have a booking for this vehicle in this period!",
    //   });
    // }

    // Create booking
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
      bookingStatus,
     payment: {
    method: payment?.method || "COD",  
  },

    });

    res
      .status(201)
      .json({ message: "Booking added successfully!", bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ error: err.message }); 
    // res.status(500).send({ error: "add booking  failed!" ,   error: err.message });
  }
};
 // const totalDays = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))

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
// get my bookin details
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
 // booking commpleted to delete this booking list
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

// const getPaymentDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const booking = await Booking.findById(id);

//     if (!booking) {
//       return res.status(404).json({
//         error: "Vehicle not found",
//       });
//     }

//     const details = {
//       amount: booking.vehicle?.pricePerDay,
//       total_amount: booking.totalPrice,
//       // transaction_uuid: booking._id,
//       transaction_uuid: `${booking._id}-${Date.now()}`,
//       product_code: "EPAYTEST",
//       product_service_charge: 0,
//       product_delevery_charge: 0,
//       success_url: "http://localhost:8001/api/booking/comfirm-payment",
//       failure_url: `http://localhost:5173/booking/${booking._id}`,
//       signed_field_names:
//         "total_amount,transaction_uuid,product_code",
//       signature: crypto
//         .createHmac("sha256", "8gBm/:&EnhH.1/q")
//         .update(
//           `total_amount=${booking.totalPrice},transaction_uuid=${booking._id},product_code=EPAYTEST`
//         )
//         .digest("base64"),
//     };

//     res.json({ details });
//   } catch (error) {
//     console.error("Payment Details Error:", error);
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };


const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the booking 
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    // Build a unique transaction UUID 
    // Must be unique per payment attempt → append Date.now()
    // IMPORTANT: This same value must be used in both the `message` and `details`
    // const transaction_uuid = `${booking._id}-${Date.now()}`;
    const transaction_uuid = `${booking._id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    //Build the signature message 
    // eSewa requires EXACTLY these three fields in this order
    // The transaction_uuid here must match the one sent in `details`
    const message = `total_amount=${booking.totalPrice},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;

    // Generate HMAC-SHA256 signature 
    //  eSewa sandbox secret (replace in production)
    const signature = crypto
      .createHmac("sha256", "8gBm/:&EnhH.1/q")
      .update(message)
      .digest("base64");

    // Build the payment details payload 
    const details = {
      // `amount` = base amount (before tax/charges), `total_amount` = final charged amount
      amount: booking.totalPrice,
      total_amount: booking.totalPrice,

      transaction_uuid, // unique per payment attempt

      product_code: "EPAYTEST", // eSewa sandbox merchant code (change in production)

      // These must be 0 if not applicable — eSewa still expects the fields
      tax_amount: 0,
      product_service_charge: 0,
      product_delivery_charge: 0, // NOTE: old code had typo "delevery" → fixed

      // Backend URL — eSewa will POST here on success
      success_url: "http://localhost:8001/api/booking/confirm-payment",

      // Frontend URL — eSewa will redirect here on failure
      failure_url: `http://localhost:5173/booking/${booking._id}`,

      // Tell eSewa which fields are included in the signature
      signed_field_names: "total_amount,transaction_uuid,product_code",

      signature, // HMAC-SHA256 base64 — must match eSewa's own calculation
    };

    console.log("Payment Details:", details);

    console.log("Sending to eSewa:", {
  total_amount: details.total_amount,
  transaction_uuid: details.transaction_uuid,
  product_code: details.product_code,
  signature: details.signature,
});

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

// const ComfirmPayment = async(req , res)=>{
//   try{ 
//     const {data} = req.query;
//     const {status , transaction_uuid} = JSON.parse(Buffer.from(data , 'base64').toString ('utf-8'));
//      if ( status == 'COMPLETE'){
//        const bookingId = transaction_uuid.split('-')[0];
//        const booking  = await Booking.findById(bookingId);
//        booking.isPaid = true;
//        booking.paidAt = new Date();
//        await booking.save();
//        return   res.redirect('http://localhost:5173/booking'+ bookingId )
//      }
//     res.json(status);


//   }
//   catch(err) {
//     console.log({error:err.message});
//   }
// }; 



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
      const bookingId = transaction_uuid.split('-')[0]; // fixed: '-' not '_'

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
console.log("Booking Found:", booking);

      booking.payment.isPaid = true;
booking.payment.paidAt = Date.now();
await booking.save();

      return res.redirect(`http://localhost:5173/bookingdetails/${bookingId}`);
      // return res.redirect(`http://localhost:5173/api/booking/${bookingId}`);


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

//  const BookingComplete  = async(req,res)=>{
//   try{
//      const booking = await Booking.findById(bookingId);
//       if (!booking) {
//         return res.status(404).json({ message: 'Booking not found' });
//       }



//   }  catch(err){
//     console.log({error:err.message})
//   }
//  }

const BookingComplete = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.BookingStatus = true;

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
  deleteBooking,
  getPaymentDetails,
  ComfirmPayment,
  BookingComplete
};
