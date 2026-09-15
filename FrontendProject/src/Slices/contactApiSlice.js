import { CONTACT_URL } from "../constant";
import apiSlice from "./Apislices";

const ContactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Send contact message (logged-in user)
    sendContactMessage: builder.mutation({
      query: (data) => ({
        url: CONTACT_URL,
        method: "POST",
        body: data, // { name, email, phoneNumber, message }
      }),
      invalidatesTags: ["ContactMessages"],
    }),

    // Get all contact messages (admin only)
    getAllContactMessages: builder.query({
      query: () => ({
        url: CONTACT_URL,
        method: "GET",
      }),
      providesTags: ["ContactMessages"],
    }),

    // Delete contact message by id (admin only)
    deleteContactMessage: builder.mutation({
      query: (id) => ({
        url: `${CONTACT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContactMessages"],
    }),
  }),
});

export const {
  useSendContactMessageMutation,
  useGetAllContactMessagesQuery,
  useDeleteContactMessageMutation,
} = ContactApiSlice;

export default ContactApiSlice;