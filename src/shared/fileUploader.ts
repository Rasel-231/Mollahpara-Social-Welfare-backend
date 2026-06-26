import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';


cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret
});

const storage = multer.diskStorage({});
const upload = multer({ storage });

export const FileUploadHelper = {
  uploadToCloudinary: async (file: any) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, (error: any, result: any) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  },
  upload,
};
