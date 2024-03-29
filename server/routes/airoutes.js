const express = require('express');
const router = express.Router();
const { generateText } = require('../controllers/aiapi');
const { rephraseText } = require('../controllers/aiapi');
const { summarize } = require('../controllers/aiapi');
const { generateCitation } = require('../controllers/aiapi');
const { chatbot } = require('../controllers/aiapi');

// Define the route and attach it to the controller
router.post('/generate-text', generateText);
router.post('/rephrase-text', rephraseText);
router.post('/summarize', summarize);
router.post('/generate-citation', generateCitation);
router.post('/chatbot', chatbot);



module.exports = router;
