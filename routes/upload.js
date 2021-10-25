import express from 'express';
import cloudinary from 'cloudinary';
import { auth } from '../middleware/auth.js';
import { authAdmin } from '../middleware/authAdmin.js';
import fs from 'fs';

const router = express.Router();

// we will upload image on cloudinary
cloudinary.v2.config({
  cloud_name: 'ducoi',
  api_key: '213734392275137',
  api_secret: 'QTz2atd1xKK2NHtVT06BEebX5Rc',
});

// upload image only admin can use
router.post('/upload', auth, authAdmin, (req, res) => {
  try {
    // console.log(req.files); //req.files là 1 object ko phải mảng
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: 'No files were uploaded' });

    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      // 1024 * 1024 * 5 = 5mb ; if file lớn hơn 1mb
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: 'Size too large' });
    }

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: 'File format is incorrect' });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: 'ecommerce' },
      function (err, result) {
        if (err) throw err;
        removeTmp(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// Delete image only admin can use
router.post('/destroy', auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(404).json({ msg: 'No images Selected' });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: 'Deleted Image' });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

export default router;
