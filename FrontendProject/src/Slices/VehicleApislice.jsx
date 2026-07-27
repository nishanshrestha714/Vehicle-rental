
import apiSlice from "./Apislices";
import { VEHICLE_URL } from "../constant";

const VehicleApislice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        getVehicle: builder.query({
            query:()=>({
                // object pass form the url 
                url:VEHICLE_URL
            }),
            keepUnusedDataFor:5,
            providesTags:["vehicle"],


        }),
        getVehicleById :builder.query({
            query:(id) =>({
                url: `${VEHICLE_URL}/${id}`
            }),
            keepUnusedDataFor:5,
        }),
//        CreateVehicle: builder.mutation({
//   query: () => ({
//     url: `${VEHICLE_URL}`,
//     method: "POST",
//     // data:product,
//   }),
//   invalidatesTags: ["vehicle"],
// }),

CreateVehicle: builder.mutation({
  query: () => ({
    url: `${VEHICLE_URL}`,
    method: "POST",
    // body: newVehicle,
  }),
  invalidatesTags: ["vehicle"],
}),
        
    }),
});

 //  this is nameing con
 export const {useGetVehicleQuery , useGetVehicleByIdQuery , useCreateVehicleMutation}  = VehicleApislice;

