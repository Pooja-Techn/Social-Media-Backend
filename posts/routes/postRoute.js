// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticateUser = require('../../middleware/authMiddleware'); // assuming JWT auth

// Base path: /api/posts

router.post('/', authenticateUser, postController.createPost);
router.get('/', authenticateUser, postController.getAllPosts);
router.get('/:id', authenticateUser, postController.getPostById);
router.put('/:id', authenticateUser, postController.updatePost);
router.delete('/:id', authenticateUser, postController.deletePost);

module.exports = router;
