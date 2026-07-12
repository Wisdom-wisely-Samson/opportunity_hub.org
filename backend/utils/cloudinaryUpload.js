const cloudinary = require("../config/cloudinary");

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {String} folder - Cloudinary folder name
 * @param {String} resourceType - "image" or "raw" (for PDFs/docs)
 */
const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
};

module.exports = { uploadToCloudinary };
