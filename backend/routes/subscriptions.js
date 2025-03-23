const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getSubscription, 
  updateSubscription, 
  cancelSubscription 
} = require('../controllers/subscriptionController');

router.get('/', auth, getSubscription);
router.put('/', auth, updateSubscription);
router.delete('/', auth, cancelSubscription);

module.exports = router; 