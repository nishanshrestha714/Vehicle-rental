import express from 'express';
import { register ,login,logout, getprofile, updateprofile} from '../controllers/user.controller.js';
import checkAuth from '../middleware/checkAuth.middleware.js';
 
const router= express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/logout', checkAuth,logout);
router.get("/profile", checkAuth,getprofile);
router.put("/update",checkAuth,updateprofile);


router.post("/", (req, res) => {
    console.log(req.body);
    res.send("ok fine server thik xa ! ");
});


export default router;

