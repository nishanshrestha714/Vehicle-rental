

const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // e.g. "File too large", "Unexpected field"
    return res.status(400).json({ message: err.message });
  }

  if (err && err.message && err.message.includes("only PDF files are allowed")) {
    return res.status(400).json({ message: err.message });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { errorHandler };

