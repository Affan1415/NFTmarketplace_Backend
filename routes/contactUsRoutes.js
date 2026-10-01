const express = require('express');
const router = express.Router();
const { contactUs } = require('../controllers/contactUsController');

// Contact Us Route
router.post('/contact-us', contactUs);

module.exports = router;
