import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
// dotenv.config({ path: './backend/.env' });

  const ConnectDB = async ()=>{
 
    
    try{
        if (!process.env.MONGODB_URL){
            throw new Error("missing in  URL from mongodb");
        };
console.log("Mongo URL =", process.env.MONGODB_URL);
     const conn=await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerce");
     console.log("connect successfully for mongoDB",conn.connection.host);

    }  

    catch(err){
        console.log("mongodb connection failed!",err.message);
    }
};
export default ConnectDB;
