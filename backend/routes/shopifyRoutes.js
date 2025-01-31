const express = require('express');
const { authenticateShop, getShopifyData } = require('../controllers/shopifyController');

const router = express.Router();

router.get('/auth', authenticateShop);
router.get('/sales-data', getShopifyData);

module.exports = router;
