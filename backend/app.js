import express from 'express';
import router from './routes/user.routs.js';
import logger from './middleware/logger.middleware.js';
import { errorhandler, notfound } from './middleware/user.middleware.js';
import Router from './routes/vehicle.routs.js';
import bookingrouter from './routes/booking.routes.js';
import Rentalrouter from './routes/rental.router.js';
import cookieParser from 'cookie-parser';
import uploads from './routes/uploads.routes.js';
// nagarikta
import nagariktarouter from './routes/nagarita.router.js';
// license
import licenserouter from './routes/license.router.js';
// addd in contact route
import contactrouter from './routes/contact.router.js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: './backend/.env' });




const app = express(); 
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use("/api/auth",router); // handle in router file all condition 
app.use("/api/vehicle", Router);
// nagarikta 
// app.use('/uploads', express.static('uploads'));
app.use("/api/nagarikta",nagariktarouter); 
// license
app.use("/api/license",licenserouter);
// add contact route
app.use("/api/contact",contactrouter);
app.use("/api/booking",bookingrouter);
app.use("/api/rentals",Rentalrouter);
app.use("/api/uploads",uploads);


const PORT =process.env.PORT || 8001 ;

app.get((req,res)=>{
    console.log(res.send('API is working'))
});
app.use(notfound);
app.use(errorhandler);

export  {PORT,app};