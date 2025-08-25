const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `company_logo_${Date.now()}${ext}`);
  }
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (ext && mimetype) {
    return cb(null, true);
  }
  
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get company profile for current user
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM company_profile WHERE user_id = $1', [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching company profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update company profile
router.post('/', [auth, upload.single('logo')], async (req, res) => {
  const { 
    company_name, 
    address, 
    mobile, 
    email, 
    gst_number, 
    bank_details 
  } = req.body;

  if (!company_name) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  try {
    // Check if a company profile already exists for this user
    const existingProfile = await db.query('SELECT * FROM company_profile WHERE user_id = $1', [req.user.id]);
    const logoPath = req.file ? `/uploads/${req.file.filename}` : (existingProfile.rows[0]?.logo_path || null);
    
    let result;
    
    if (existingProfile.rows.length > 0) {
      // Update existing profile
      result = await db.query(
        `UPDATE company_profile SET 
        company_name = $1, 
        address = $2, 
        mobile = $3, 
        email = $4, 
        gst_number = $5, 
        bank_details = $6,
        logo_path = $7,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = $8 AND user_id = $9
        RETURNING *`,
        [company_name, address, mobile, email, gst_number, bank_details, logoPath, existingProfile.rows[0].id, req.user.id]
      );
    } else {
      // Create new profile
      result = await db.query(
        `INSERT INTO company_profile 
        (company_name, address, mobile, email, gst_number, bank_details, logo_path, user_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [company_name, address, mobile, email, gst_number, bank_details, logoPath, req.user.id]
      );
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving company profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
