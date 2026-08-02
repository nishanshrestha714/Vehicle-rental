import { NAGARIKTA_URL } from "../constant";
import apiSlice from "./Apislices";

const NagariktaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    NagariktaApi: builder.mutation({
      query: (data) => ({
        url: `${NAGARIKTA_URL}`,
        method: "POST",
        body: data,
      }),
      //used to tell RTK Query:
      //tells cache to refresh
      invalidatesTags: ["Nagarikta"],
    }),
    
    getMyNagariktaStatus: builder.query({
      query: () => ({
        url: `${NAGARIKTA_URL}/mystatus`,
      }),
      keepUnusedDataFor: 10,
      //marks cached data
      providesTags: ["Nagarikta"],  
    }),
    // only admin view in this user nagarikta details
    getAllNagarikta: builder.query({
      query: () => ({
        url: `${NAGARIKTA_URL}`,
      }),
      keepUnusedDataFor: 10,
      //marks cached data
      providesTags: ["Nagarikta"],
    }),
    verifyNagarikta: builder.mutation({
      query: (id) => ({
        url: `${NAGARIKTA_URL}/${id}/verify`,
        method: "PUT", 
      }),
        invalidatesTags: ["Nagarikta"],
    }),
    // as a admin only
    deleteNagarikta: builder.mutation({
      query: (id) => ({
        url: `${NAGARIKTA_URL}/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Nagarikta"],
    }),

    searchNagarikta: builder.query({
  query: (nagariktaNumber) => ({
    url: `${NAGARIKTA_URL}/search`,
    params: { nagariktaNumber },
  }),
  providesTags: ["Nagarikta"],
}),


getNagariktaById: builder.query({
  query: (id) => ({
    url: `${NAGARIKTA_URL}/${id}`,
  }),
  providesTags: ["Nagarikta"],
}),



  }),


});

export const {
  useNagariktaApiMutation,
  useGetMyNagariktaStatusQuery,
  useGetAllNagariktaQuery,
  useVerifyNagariktaMutation,
  useDeleteNagariktaMutation,
   useSearchNagariktaQuery,
   useGetNagariktaByIdQuery
} = NagariktaApiSlice;

// builder.query()    → providesTags    (data dinxa)
// builder.mutation() → invalidatesTags (cache clear garxa)

