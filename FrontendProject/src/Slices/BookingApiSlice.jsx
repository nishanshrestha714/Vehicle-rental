
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
      invalidatesTags: ["Booking"],
    }),
    getMyBooking: builder.query({
      query: () => ({
        url: `${MYBOOKING_LIST}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Booking"],
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
      providesTags: ["Booking"],
    }),
    CompletedBooking: builder.mutation({
      query: ({ bookingId }) => ({
        url: `${BOOKING_URL}/${bookingId}/bookingConfirm`,
        method: "PUT",
      }),
      keepUnusedDataFor: 5,
      invalidatesTags: ["Booking"],
    }),

    // Update an existing booking (dates / pickup / drop location).
    // Expects: { id, bookingPeriod: { start, end }, pickupLocation, dropLocation }
    updateBooking: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BOOKING_URL}/${id}/updated`, 
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Cancel a booking. Expects the bookingId as the argument.
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `${BOOKING_URL}/${bookingId}/cancel`,
        method: "PUT",
      }),
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
  useCompletedBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
} = BookingApiSlice;