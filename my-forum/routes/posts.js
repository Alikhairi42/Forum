const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// GET /posts/new - Show create form
router.get('/new', postController.showCreate);

// POST /posts - Create post
router.post('/', postController.create);

// GET /posts/:id - Show single post
router.get('/:id', postController.show);

// POST /posts/:id/delete - Delete post
router.post('/:id/delete', postController.delete);

// GET /posts/user/my-posts - User's posts
router.get('/user/my-posts', postController.myPosts);

module.exports = router;