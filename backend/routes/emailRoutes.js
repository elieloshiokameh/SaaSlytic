const express = require('express');
const { sendReportEmail } = require('../controllers/emailController');

const router = express.Router();

router.post('/send-report', sendReportEmail);

module.exports = router;
