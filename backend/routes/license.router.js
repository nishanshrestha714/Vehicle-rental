import express from 'express';
import { addlicense, cotogory, getAllLicense, verifylicense } from '../controllers/license.cotroller.js';
import checkAuth from '../middleware/checkAuth.middleware.js';
import checkAdmin from '../middleware/checkAdmin.middleware.js';
const router = express.Router();

router.post("/", checkAuth  ,addlicense);
router.get("/",checkAuth,checkAdmin,getAllLicense);
router.post("/category" , cotogory);
router.put("/:id/verify",  checkAuth,checkAdmin,verifylicense);


export default router;
  