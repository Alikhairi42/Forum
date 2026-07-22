const express = require("express");
const router = express.Router();
const posController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', posController.getAllPosts);

router.post('/', authMiddleware, posController.createPost);
router.put('/:id', authMiddleware, posController.updatePost);
router.delete('/:id', authMiddleware, posController.deletePost);
module.exports = router;