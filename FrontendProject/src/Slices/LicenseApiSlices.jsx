import { LICENSE_CATAGORY, LICENSE_URL } from "../constant";
import apiSlice from "./Apislices";

const LicenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    LicenseApi: builder.mutation({
      query: (data) => ({
        url: `${LICENSE_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["license"],
    }),

    getLicense: builder.query({
      query: () => ({
        url: `${LICENSE_URL}`,
      }),
      keepUnusedDataFor: 10,
      providesTags: ["license"],
    }),

    // logged-in user's own license (GET /license/mystatus)
    getMyLicense: builder.query({
      query: () => ({
        url: `${LICENSE_URL}/mystatus`,
      }),
      keepUnusedDataFor: 10,
      providesTags: ["license"],
    }),

    // admin: single license by id (GET /license/:id)
    getLicenseById: builder.query({
      query: (id) => ({
        url: `${LICENSE_URL}/${id}`,
      }),
      providesTags: ["license"],
      // providesTags: (result, error, id) => [{ type: "license", id }],
    }),

    // admin: verify a license (PUT /license/:id/verify)
    verifyLicense: builder.mutation({
      query: (id) => ({
        url: `${LICENSE_URL}/${id}/verify`,
        method: "PUT",
      }),
      invalidatesTags: ["license"],
    }),

    LicenseCatagory: builder.mutation({
      query: (data) => ({
        url: `${LICENSE_CATAGORY}`,
        method: "POST",
        body: data,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLicenseApiMutation,
  useGetLicenseQuery,
  useGetMyLicenseQuery,
  useGetLicenseByIdQuery,
  useVerifyLicenseMutation,
  useLicenseCatagoryMutation,
} = LicenseApiSlice;