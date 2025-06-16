const express = require('express');
const likeController = require('../controllers/likeController.js');
const authenticateUser = require('../../middleware/authMiddleware.js');

const likeRouter = express.Router();

// POST /api/like/:postId
likeRouter.post('/:postId', authenticateUser, (req, res, next) => {
  req.postId = req.params.postId;
  likeController.likePost(req, res, next);
});

// DELETE /api/like/:postId
likeRouter.delete('/:postId', authenticateUser, (req, res, next) => {
  req.postId = req.params.postId;
  likeController.unlikePost(req, res, next);
});

module.exports = likeRouter;