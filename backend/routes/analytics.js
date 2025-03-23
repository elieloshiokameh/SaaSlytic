const express = require('express');
const router = express.Router();
const { getMetrics, getPredictions } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.get('/metrics', auth, getMetrics);
router.get('/predictions', auth, getPredictions);

module.exports = router; 