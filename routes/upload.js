const express = require('express');
const path = require('path');
const fs = require('fs');
const { 
  uploadMultiple, 
  uploadSingle, 
  uploadCars, 
  uploadBrands, 
  uploadBanners, 
  uploadRentals,
  uploadDir
} = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Helper function to get upload middleware based on type
const getUploadMiddleware = (type) => {
  switch (type) {
    case 'brands':
      return { single: uploadBrands.single('image'), multiple: uploadBrands.array('images', 10) };
    case 'banners':
      return { single: uploadBanners.single('image'), multiple: uploadBanners.array('images', 10) };
    case 'rentals':
      return { single: uploadRentals.single('image'), multiple: uploadRentals.array('images', 10) };
    case 'cars':
    default:
      return { single: uploadCars.single('image'), multiple: uploadCars.array('images', 10) };
  }
};

const UPLOAD_TYPES = ['cars', 'brands', 'banners', 'rentals'];

// Only allow known upload folders; anything else falls back to cars.
const normalizeType = (type) => (UPLOAD_TYPES.includes(type) ? type : 'cars');

// Resolve a file inside the uploads folder, rejecting path traversal
// (e.g. "../server.js" or "..%2F.env"). Returns null for invalid input.
const resolveUploadPath = (type, filename) => {
  if (!UPLOAD_TYPES.includes(type)) return null;
  if (!filename || filename !== path.basename(filename) || filename.startsWith('.')) return null;
  return path.join(uploadDir, type, filename);
};

const invalidPath = (res) =>
  res.status(400).json({ success: false, message: 'Invalid file path' });

// Test route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Upload API is working',
    endpoints: {
      single: 'POST /api/upload/single?type=cars|brands|banners|rentals',
      multiple: 'POST /api/upload/multiple?type=cars|brands|banners|rentals',
      delete: 'DELETE /api/upload/:type/:filename',
      info: 'GET /api/upload/info/:type/:filename'
    }
  });
});

// Upload single image
router.post('/single', protect, adminOnly, (req, res) => {
  const type = normalizeType(req.query.type);
  const uploadMiddleware = getUploadMiddleware(type);
  
  uploadMiddleware.single(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = `/uploads/${type}/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: imageUrl,
        size: req.file.size,
        type: type
      }
    });
  });
});

// Upload multiple images
router.post('/multiple', protect, adminOnly, (req, res) => {
  const type = normalizeType(req.query.type);
  const uploadMiddleware = getUploadMiddleware(type);
  
  uploadMiddleware.multiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const images = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${type}/${file.filename}`,
      size: file.size
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: images,
      type: type
    });
  });
});

// Delete image
router.delete('/:type/:filename', protect, adminOnly, (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = resolveUploadPath(type, filename);
    if (!filePath) return invalidPath(res);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: {
        filename: filename,
        type: type
      }
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

// Backward compatibility - delete from cars folder
router.delete('/:filename', protect, adminOnly, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = resolveUploadPath('cars', filename);
    if (!filePath) return invalidPath(res);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image'
    });
  }
});

// Get image info
router.get('/info/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = resolveUploadPath(type, filename);
    if (!filePath) return invalidPath(res);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const stats = fs.statSync(filePath);
    
    res.status(200).json({
      success: true,
      data: {
        filename,
        url: `/uploads/${type}/${filename}`,
        size: stats.size,
        type: type,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      }
    });
  } catch (error) {
    console.error('Error getting image info:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting image info'
    });
  }
});

// Backward compatibility - get info from cars folder
router.get('/info/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = resolveUploadPath('cars', filename);
    if (!filePath) return invalidPath(res);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const stats = fs.statSync(filePath);
    
    res.status(200).json({
      success: true,
      data: {
        filename,
        url: `/uploads/cars/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      }
    });
  } catch (error) {
    console.error('Error getting image info:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting image info'
    });
  }
});

module.exports = router;