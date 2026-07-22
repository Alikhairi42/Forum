const express = require("express");
const router = express.Router();
const posController = require("../controllers/postController");
const midlware = require("../middleware/authMiddleware");

router.get('/', posController.getAllPosts);

router.post('/', midlware, posController.createPost);
module.exports = router;