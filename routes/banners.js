const express = require('express');
const multer = require('multer');
const db = require('../db');
const { getStorage } = require('../utils/cloudinary');

const router = express.Router();

// Upload banner
router.post('/upload', (req, res) => {
  const storage = getStorage('banners');
  const upload = multer({ storage }).single('file');

  upload(req, res, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const image_url = req.file.path;
    const sql = `INSERT INTO banners (image_url) VALUES (?)`;

    db.query(sql, [image_url], (error, result) => {
      if (error) return res.status(500).json({ error });
      res.json({ message: 'Banner uploaded successfully', id: result.insertId, image_url });
    });
  });
});

// Get all banners
router.get('/', (req, res) => {
  db.query(`SELECT * FROM banners ORDER BY created_at DESC`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Delete a banner
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM banners WHERE id = ?`;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Banner deleted successfully' });
  });
});

module.exports = router;
