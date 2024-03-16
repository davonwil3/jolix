const express = require('express');
const router = express.Router();
const { generateText } = require('../controllers/aiapi');
const { rephraseText } = require('../controllers/aiapi');

// Define the route and attach it to the controller
router.post('/generate-text', generateText);
router.post('/rephrase-text', rephraseText);

module.exports = router;
