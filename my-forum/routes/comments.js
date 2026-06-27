const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// POST /comments - Create comment
router.post('/', commentController.create);

// DELETE /comments/:id - Delete comment
router.delete('/:id', commentController.delete);

module.exports = router;