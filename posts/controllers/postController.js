// controllers/postController.js
const postRepo = require('../repository/postRepository');
const Like = require('../../likes/models/likes'); // Make sure the path is correct

exports.createPost = async (req, res) => {
  try {
    const { content, mediaUrl } = req.body;
    const authorId = req.user.userId;

    const newPost = await postRepo.createPost({
      content,
      mediaUrl,
      author: authorId,
    });

    // ✅ Populate author details (email, name)
    const populatedPost = await newPost.populate('author', 'name email');

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postRepo.getAllPosts();

    // Get post IDs
    const postIds = posts.map(post => post._id);

    // Aggregate likes count for each post
    const likes = await Like.aggregate([
      { $match: { targetType: 'Post', targetId: { $in: postIds } } },
      { $group: { _id: '$targetId', count: { $sum: 1 } } }
    ]);

    // Map postId to like count
    const likeCountMap = {};
    likes.forEach(like => {
      likeCountMap[like._id.toString()] = like.count;
    });

    // If req.user is not set, treat as not liked by current user
    let likedPostIds = new Set();
    if (req.user && req.user.userId) {
      const userId = req.user.userId;
      const userLikes = await Like.find({
        targetType: 'Post',
        targetId: { $in: postIds },
        user: userId
      }).select('targetId');
      likedPostIds = new Set(userLikes.map(like => like.targetId.toString()));
    }

    // Attach like count and likedByCurrentUser to each post
    const postsWithLikes = posts.map(post => {
      const postObj = post.toObject ? post.toObject() : post;
      postObj.likeCount = likeCountMap[post._id.toString()] || 0;
      postObj.likedByCurrentUser = likedPostIds.has(post._id.toString());
      return postObj;
    });

    res.status(200).json(postsWithLikes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await postRepo.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const updated = await postRepo.updatePost(req.params.id, req.user._id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await postRepo.deletePost(req.params.id, req.user.userId);
    res.status(204).send('post deleted successfully'); // no content
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
