const express = require('express');
const router = express.Router();
const reactController = require('../controllers/reactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, reactController.toggleReact);

router.get('/:postId', reactController.getPostReacts);

module.exports = router;