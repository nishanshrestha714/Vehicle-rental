import express from 'express';
import { addNagarikta, deleteNagarikta, getMyNagariktaStatus, getNagarikta, updatenagarikta, verifynagarikta } from '../controllers/nagarikta.conroller.js';
import checkAuth from '../middleware/checkAuth.middleware.js';
import checkAdmin from "../middleware/checkAdmin.middleware.js";

const router = express.Router();
router.get("/mystatus" , checkAuth , getMyNagariktaStatus);
router.get("/",checkAuth,checkAdmin,getNagarikta);
router.post("/", checkAuth,addNagarikta);
router.put("/:id/update",checkAuth,updatenagarikta);
router.put("/:id/verify",checkAuth ,checkAdmin , verifynagarikta);
router.delete("/:id/delete", checkAuth,checkAdmin,deleteNagarikta);

export default router; 