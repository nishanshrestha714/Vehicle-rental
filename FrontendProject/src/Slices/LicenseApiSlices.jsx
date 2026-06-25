import { LICENSE_CATAGORY, LICENSE_URL } from "../constant";
import apiSlice from "./Apislices";
 

 const LicenseApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        LicenseApi:builder.mutation({
            query:(data) =>({
                url:`${LICENSE_URL}`,
                method:"POST",
                body:data,
            }),
            keepUnusedDataFor:4,
        }),
        LicenseCatagory:builder.mutation({
            query:(data)=>({
                url:`${LICENSE_CATAGORY}`,
                method:"POST",
                body:data,
            }),
            KeepUnusedDataFor:5,

        })
    }),
 }); 
 

 export const {useLicenseApiMutation, useLicenseCatagoryMutation} = LicenseApiSlice;