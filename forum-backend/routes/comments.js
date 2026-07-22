const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, commentController.createComment);

router.get('/:postId', commentController.getPostComments);

router.put('/:commentId', authMiddleware, commentController.updateComment);
router.delete('/:commentId', authMiddleware, commentController.deleteComment);
module.exports = router;