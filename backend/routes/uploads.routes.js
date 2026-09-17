import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import checkAuth from "../middleware/checkAuth.middleware.js";
import checkAdmin from "../middleware/checkAdmin.middleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({
// const storage = multer.memoryStorage({

  destination: (req, file, cb) => {
    fs.mkdirSync("uploads/", { recursive: true });
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filename =
      Date.now() + "-" + file.fieldname + path.extname(file.originalname);
    cb(null, filename);
  },
});

//  Existing standalone image upload (unchanged, still works)
const imageOnlyFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const imageUpload = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

//  Combined vehicle upload: image + PDFs in one request
const combinedFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("image must be an image file (jpg, png, webp)"), false);
  }
  if (file.mimetype === "application/pdf") return cb(null, true);
  return cb(new Error(`${file.fieldname} must be a PDF file`), false);
};

const combinedUpload = multer({
  storage,
  fileFilter: combinedFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});

const router = express.Router();

// POST /api/uploads  (single image only — kept for any other callers)
router.post("/", imageUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "No image file provided" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "vehicles",
      transformation: [{ width: 200, height: 240 }],
    });

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

router.post(
  "/vehicle-documents",
  checkAuth,
  checkAdmin,
  combinedUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "bluebook", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "documents", maxCount: 1 },
  ]),
  async (req, res) => {
    const uploadedLocalPaths = [];

    try {
      const files = req.files || {};

      if (
        !files.image &&
        !files.bluebook &&
        !files.insurance &&
        !files.documents
      ) {
        return res.status(400).send({ error: "No file provided" });
      }

      const urls = {};

      const imageFile = files.image?.[0];
      if (imageFile) {
        uploadedLocalPaths.push(imageFile.path);
        const result = await cloudinary.uploader.upload(imageFile.path, {
          folder: "vehicles",
          transformation: [{ width: 200, height: 240 }],
        });
        urls.image = result.secure_url;
      }

      for (const field of ["bluebook", "insurance", "documents"]) {
        const file = files[field]?.[0];
        if (!file) continue;

        uploadedLocalPaths.push(file.path);

        const result = await cloudinary.uploader.upload(file.path, {
          folder: `vehicles/documents/${field}`,
          resource_type: "raw",
          access_mode: "public",
          type: "upload",
        });

        urls[field] = result.secure_url;
      }

      uploadedLocalPaths.forEach((p) => fs.unlinkSync(p));

      res.status(200).send({
        message: "File(s) uploaded successfully",
        urls,
      });
    } catch (err) {
      uploadedLocalPaths.forEach((p) => {
        if (fs.existsSync(p)) fs.unlinkSync(p);
      });
      console.log("CLOUDINARY UPLOAD ERROR:", err);
      res.status(500).send({ error: err.message });
    }
  },
);

export default router;
