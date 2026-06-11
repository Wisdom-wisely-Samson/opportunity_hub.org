const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const bufferToStream = (buffer) => {
  const readable = new Readable({ read() {} });
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const uploadImage = (fileBuffer, folder = 'opportunity-hub/images') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    bufferToStream(fileBuffer).pipe(uploadStream);
  });
};

const uploadDocument = (fileBuffer, originalName, folder = 'opportunity-hub/cvs') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'raw',
        format: 'pdf',
        public_id: `cv_${Date.now()}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id, filename: originalName });
      }
    );
    bufferToStream(fileBuffer).pipe(uploadStream);
  });
};

const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

module.exports = { uploadImage, uploadDocument, deleteFile };
