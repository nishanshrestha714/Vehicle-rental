// import { RENTAL_URL } from "../constant";
// import apiSlice from "./Apislices";

// const RentApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     rentApi: builder.mutation({
//       query: (data) => ({
//         url: `${RENTAL_URL}`,
//         method: "POST",
//         body: data,
//       }),
//     }),
//     completeRental: builder.mutation({
//       query: (bookingId) => ({
//         url: `${RENTAL_URL}/${bookingId}/complete`,
//         method: "PUT",
//       }),
//     //   invalidatesTags: ["Booking"],
//     }),
//   }),
// });

// export const { useRentApiMutation, useCompleteRentalMutation } = RentApiSlice;

import { RENTAL_URL } from "../constant";
import apiSlice from "./Apislices";

const RentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    rentApi: builder.mutation({
      query: (data) => ({
        url: `${RENTAL_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),

    // bookingId is passed directly (a plain string), NOT { bookingId: ... }
    completeRental: builder.mutation({
      query: (bookingId) => ({
        url: `${RENTAL_URL}/${bookingId}/complete`,
        method: "PUT",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const { useRentApiMutation, useCompleteRentalMutation } = RentApiSlice;