import { Request, Response } from "express";
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { PORT } from "../constants/config";

const getStorage = () => {
  const uploadsDir = path.join(__dirname, '../../products-images');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const productId = req.params.productId;
      if (!productId) {
        return cb(new Error('Product ID is required'), '');
      }

      const ext = path.extname(file.originalname);
      cb(null, `${productId}${ext}`);
    }
  });
}

const uploadMiddleware = multer({
  storage: getStorage(),
  limits: { fileSize: 1024 * 100 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
}).single('image');

export const productImageUpload = (req: Request, res: Response) => {
  uploadMiddleware(req as any, res as any, async err => {
    if (err) {
      return res.status(400).json({ sucess: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ sucess: false, error: 'No file uploaded' });
    }

    try {
      const imageUrl = `http://localhost:${PORT}/api/products/images/${req.file.filename}`;
      return res.json({
        message: 'File uploaded locally successfully',
        filename: req.file.filename,
        url: imageUrl
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ sucess: false, error: 'Upload failed' });
    }
  });
};
