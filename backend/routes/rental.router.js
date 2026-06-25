import express from 'express';
import { addVehicleRent, deleteRental, getAllRentals, getrentalById, updateRental } from "../controllers/rent.controller.js";
import checkAuth from '../middleware/checkAuth.middleware.js';

const router = express.Router();

router.post("/",checkAuth ,addVehicleRent);
router.get("/",checkAuth, getAllRentals)
router.get("/:id",checkAuth,getrentalById);
router.put("/:id",checkAuth,updateRental);
router.delete("/:id",checkAuth , deleteRental)

export default router;

