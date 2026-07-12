const multer = require("multer");

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"), false);
};

const documentFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

const imageUpload = multer({ storage, fileFilter: imageFileFilter });
const documentUpload = multer({ storage, fileFilter: documentFileFilter });

module.exports = { imageUpload, documentUpload };
