const express = require('express');
const router = express.Router();
const { getDeforestationPrediction } = require('../controllers/predictionController');

router.get('/deforestation', getDeforestationPrediction);

module.exports = router;