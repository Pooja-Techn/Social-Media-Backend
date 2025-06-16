const Like = require('../models/likes');

async function addLike({ userId, postId }) {
  return Like.create({
    user: userId,
    targetType: 'Post',
    targetId: postId,
  });
}

async function removeLike({ userId, postId }) {
  return Like.findOneAndDelete({
    user: userId,
    targetType: 'Post',
    targetId: postId,
  });
}

module.exports = {
  addLike,
  removeLike,
};