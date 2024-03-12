const express = require('express');
const router = express.Router();
const { generateText } = require('../controllers/aiapi');

// Define the route and attach it to the controller
router.post('/generate-text', generateText);

module.exports = router;
