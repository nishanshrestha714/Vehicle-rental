
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

        }),
        getVehicleById :builder.query({
            query:(id) =>({
                url: `${VEHICLE_URL}/${id}`
            }),
            keepUnusedDataFor:5,
        }),
        
    }),
});

 //  this is nameing con
 export const {useGetVehicleQuery , useGetVehicleByIdQuery}  = VehicleApislice;

