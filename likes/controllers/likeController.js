const likeRepository = require('../repositories/likeRepository');

async function likePost(req, res) {
  const userId = req.user.userId; // Assuming user is authenticated and attached to req
  const { postId } = req // Corrected to get postId from request body

  try {
    await likeRepository.addLike({ userId, postId });
    res.status(201).json({ message: 'Post liked' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Already liked' });
    }
    res.status(500).json({ message: 'Error liking post' });
  }
}

async function unlikePost(req, res) {
  const userId = req.user.userId; // Assuming user is authenticated and attached to req
  const { postId } = req;

  try {
    const result = await likeRepository.removeLike({ userId, postId });
    if (!result) {
      return res.status(404).json({ message: 'Like not found' });
    }
    res.json({ message: 'Post unliked' });
  } catch (err) {
    res.status(500).json({ message: 'Error unliking post' });
  }
}

module.exports = {
  likePost,
  unlikePost,
};