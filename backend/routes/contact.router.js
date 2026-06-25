import express from 'express';
import checkAuth from '../middleware/checkAuth.middleware.js';
import { deleteMessage, getAllMessage, sendMessage } from '../controllers/contact.controller.js';
import checkAdmin from '../middleware/checkAdmin.middleware.js';

const router = express.Router();
router.post("/", checkAuth ,sendMessage);
router.get("/",checkAuth,checkAdmin,getAllMessage);
router.delete("/:id",checkAuth,checkAdmin,deleteMessage);


export default router;
