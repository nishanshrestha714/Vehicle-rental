
import apiSlice from "./Apislices";
import { VEHICLE_URL } from "../constant";

const VehicleApislice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicle: builder.query({
      query: () => ({
        url: VEHICLE_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["vehicle"],
    }),
    getVehicleById: builder.query({
      query: (id) => ({
        url: `${VEHICLE_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["vehicle"],
    }),

    CreateVehicle: builder.mutation({
      query: (newVehicle) => ({
        url: `${VEHICLE_URL}`,
        method: "POST",
        body: newVehicle,
      }),
      invalidatesTags: ["vehicle"],
    }),

    deleteVehicle: builder.mutation({
      query: ({ VehicleId }) => ({
        url: `${VEHICLE_URL}/${VehicleId}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["vehicle"],
    }),

    updateVehicle: builder.mutation({
      query: (vehicle) => ({
        url: `${VEHICLE_URL}/${vehicle._id}`,
        method: "PUT",
        body: vehicle,
      }),
      invalidatesTags: ["vehicle"],
    }),

  
 uploadVehicleDocuments: builder.mutation({
  query: (formData) => ({
    url: "/api/uploads/vehicle-documents", 
    method: "POST",
    body: formData,
  }),
}),
  }),
});

export const {
  useGetVehicleQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
  useUpdateVehicleMutation,
  useUploadVehicleDocumentsMutation,
} = VehicleApislice;