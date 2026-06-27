const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');

// POST /reactions - Toggle reaction
router.post('/', reactionController.toggle);

module.exports = router;