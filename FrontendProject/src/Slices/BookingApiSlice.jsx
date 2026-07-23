import { BOOKING_URL, MYBOOKING_LIST } from "../constant";
import apiSlice from "./Apislices";
const BookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    VehicleBooking: builder.mutation({
      query: (data) => ({
        url: `${BOOKING_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getMyBooking: builder.query({
      query: () => ({
        url: `${MYBOOKING_LIST}`,
        method: "GET",
      }),
    }),
    getBookingById:builder.query({
      query:(bookingId)=>({
        url:`${BOOKING_URL}/${bookingId}`
      }),
      keepUnusedDataFor:5,
    }),
    EsewaPaymentDetails:builder.query({
      query:(id)=>({
        url:`${BOOKING_URL}/${id}/get-payment-details`,
      }),
    }),

  }),
});

export const { useVehicleBookingMutation  , useGetMyBookingQuery,useGetBookingByIdQuery , useEsewaPaymentDetailsQuery
} = BookingApiSlice;
