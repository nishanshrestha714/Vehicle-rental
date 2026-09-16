import express from 'express';
import ConnectDB from './databaseConnect/user.db.js';
import { PORT,app } from './app.js';
import 'dotenv/config';

// import dotenv

// so localhsot port number store in variable 


ConnectDB().then(()=>{
    if (process.env.NODE_ENV !="production"){

    
app.listen(PORT,()=>{
    console.log(`server is running ${PORT}` )
    console.log("Looking for URL in:", process.cwd());
    console.log("URL found:", process.env.MONGODB_URL);
});
    }
});



