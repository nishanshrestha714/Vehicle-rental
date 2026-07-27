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
    getBookingById: builder.query({
      query: (bookingId) => ({
        url: `${BOOKING_URL}/${bookingId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Booking"],
    }),
    EsewaPaymentDetails: builder.query({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}/get-payment-details`,
      }),
    }),

    getAllbooking: builder.query({
      query: () => ({
        url: `${BOOKING_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    CompletedBooking: builder.mutation({
      query: ({ bookingId }) => ({
        url: `${BOOKING_URL}/${bookingId}/bookingConfirm`,
        method: "PUT",
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useVehicleBookingMutation,
  useGetMyBookingQuery,
  useGetBookingByIdQuery,
  useEsewaPaymentDetailsQuery,
  useGetAllbookingQuery,
  useCompletedBookingMutation
} = BookingApiSlice;
