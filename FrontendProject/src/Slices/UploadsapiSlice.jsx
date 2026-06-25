import { UPLOAD_URL } from "../constant";
import apiSlice from "./Apislices";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApiSlice;