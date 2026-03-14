const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Enable CORS for all routes and origins on LAN
app.use(cors());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // timestamp-originalfilename
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  }
});

// Create Multer instance, accepting up to 10GB file size
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024 // 10 GB limit
  }
});

// Upload API endpoint
app.post('/api/upload', upload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files were uploaded.' });
    }

    const uploadedFiles = req.files.map(file => {
      console.log(`[Upload Success] File saved: ${file.filename} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      return file.filename;
    });

    res.json({
      success: true,
      filename: uploadedFiles[0], // the assignment says return 'filename' in the object for a single upload example, but we support an array.
      filenames: uploadedFiles // optionally provide all names if multiple files uploaded at once
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` LAN File Receiver Server is running!`);
  console.log(` Listening on all network interfaces (0.0.0.0).`);
  console.log(` Access via http://localhost:${PORT}`);
  console.log(` Or use your PC's IP address from other devices.`);
  console.log(`===============================================`);
});
