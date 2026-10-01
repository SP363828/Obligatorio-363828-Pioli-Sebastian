const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');

function uploadImage(buffer, folder = 'recursos') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });
}

function deleteImage(publicId) {
  if (!publicId) return Promise.resolve();
  return cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadImage, deleteImage };