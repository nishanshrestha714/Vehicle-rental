

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';                          
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //  auto-create folder
    fs.mkdirSync('uploads/', { recursive: true }); 
    cb(null, 'uploads/');
    // removed console.log(req.file) — undefined here
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    // console.log("FILE:", req.file);

    //  Guard — return error if no file sent
    if (!req.file) {
      return res.status(400).send({ error: "No image file provided" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "vehicles",
      transformation: [{ width: 200, height: 240 }],
    });

    //  Delete local file after upload to save disk space
    fs.unlinkSync(req.file.path);

    res.status(200).send({
      message: "Image uploaded successfully",
      image: result.secure_url,
    });

  } catch (err) {
    console.log("CLOUDINARY ERROR:", err);
    res.status(500).send({ error: err.message });
  }
});

export default router;

// in simple note form warning and error slove this note 
//No file sent → crash on req.file.path and this slove  Add if (!req.file) guard
//Local file never deletedfs.unlinkSync(req.file.path) after upload
//req.file logged in wrong placeMove log to route handler

//uploads/ folder missing crashes multerfs.mkdirSync('uploads/', { recursive: true })



//  this is code for comment and error code 

// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import {v2 as cloudinary} from 'cloudinary';


// cloudinary.config({
//     cloud_name:process.env.CLOUD_NAME,
//     api_key:process.env.API_KEY,
//     api_secret:process.env.API_SECRET
// });
// // console.log("REQ.FILE =", req.file);
// console.log( "this is claude name ",process.env.CLOUD_NAME);
// console.log( "this is api key",process.env.API_KEY);
// // console.log("this is api secret key",process.env.API_SECRET)
// console.log("Server Time:", new Date());
// console.log(new Date());
// console.log(process.version);


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//     console.log("REQ.FILE =", req.file);
//   },
  
//   filename: (req, file, cb) => {  
//     const filename = Date.now() + path.extname(file.originalname);
//     cb(null, filename);
//   }
// });

// const imageFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files allowed'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter: imageFilter,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB
// });


// const router = express.Router();
// router.post('/', upload.single('image'), async (req, res) => {
//  try{
//       console.log("FILE:", req.file);

//   const result = await  cloudinary.uploader.upload(req.file.path, {
//     folder:"vehicles",
//     transformation:[{width:200, height:240}]
//   })
//   res.status(200).send({message:"image upload sucess",  image:result.secure_url})

//   }
// //  console.log("Uploading file:", req.file?.path);
// // console.log("Current Time:", new Date().toISOString());
//  catch(err){
//       console.log("CLOUDINARY ERROR:", err);
//   console.dir(err, { depth: null });
//   res.status(500).send({error:err.message});
  
//  }
// });

// export default router;