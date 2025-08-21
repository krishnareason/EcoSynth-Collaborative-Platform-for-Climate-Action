const express = require('express');
const router = express.Router();
const { getThreats } = require('../controllers/threatController');

// Define routes
router.get('/', getThreats);

module.exports = router;