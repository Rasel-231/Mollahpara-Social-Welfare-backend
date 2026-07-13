import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../config';


cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret
});

const ALLOWED_MIMETYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
];

const storage = multer.diskStorage({});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Only images and PDF are accepted.`));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const cleanupFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // ignore cleanup errors
  }
};

export const FileUploadHelper = {
  uploadToCloudinary: async (file: any) => {
    try {
      const result = await cloudinary.uploader.upload(file.path);
      return result;
    } finally {
      cleanupFile(file.path);
    }
  },
  upload,
};
