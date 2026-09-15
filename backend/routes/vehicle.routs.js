import express from "express";
import checkAuth from "../middleware/checkAuth.middleware.js";
import checkAdmin from "../middleware/checkAdmin.middleware.js";
import { addreview, addVechiles, deleteVehicle, getVehicleById, getVehicles, updateReview, UpdateVehicle } from "../controllers/vehicle.controller.js";


const router = express.Router();
router.get("/", getVehicles);
router.post("/" ,checkAuth,checkAdmin,addVechiles);
router.get("/:id", getVehicleById);
router.post("/:vehicleId/review", checkAuth , addreview);
router.put("/:vehicleId/review/:reviewId" , checkAuth , updateReview );
router.put("/:id", checkAuth,checkAdmin,UpdateVehicle); 
router.delete("/:id/delete", checkAuth, checkAdmin,deleteVehicle)

  

export default router;
 