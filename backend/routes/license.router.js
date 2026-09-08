import express from 'express';
import { addlicense, cotogory, getAllLicense, getMyLicense, verifylicense } from '../controllers/license.cotroller.js';
import checkAuth from '../middleware/checkAuth.middleware.js';
import checkAdmin from '../middleware/checkAdmin.middleware.js';
const router = express.Router();

router.post("/", checkAuth  ,addlicense);
router.get("/",checkAuth,checkAdmin,getAllLicense);
router.get("/:id", checkAuth, getMyLicense);

router.post("/category" , cotogory);
router.put("/:id/verify",  checkAuth,checkAdmin,verifylicense);

 
export default router;
  





// import express from 'express';
// import {
//   addlicense,
//   cotogory,
//   getAllLicense,
//   getMyLicense,
//   getLicenseById,
//   verifylicense,
// } from '../controllers/license.cotroller.js';
// import checkAuth from '../middleware/checkAuth.middleware.js';
// import checkAdmin from '../middleware/checkAdmin.middleware.js';

// const router = express.Router();

// router.post("/", checkAuth, addlicense);
// router.get("/", checkAuth, checkAdmin, getAllLicense);
// router.get("/mine", checkAuth, getMyLicense);          // logged-in user's own license
// router.get("/:id", checkAuth, checkAdmin, getLicenseById); // admin lookup by license _id
// router.post("/category", cotogory);
// router.put("/:id/verify", checkAuth, checkAdmin, verifylicense);

// export default router;