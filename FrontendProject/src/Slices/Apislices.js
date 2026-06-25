import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASR_URL } from "../constant";
const baseQuery = fetchBaseQuery({ baseUrl: BASR_URL });

const apiSlice = createApi({
  baseQuery,
  tagTypes: ["vehicle", "user", "nagarikta", "license", "booking", "rental"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
