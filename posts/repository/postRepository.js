// repositories/postRepository.js
const Post = require('../models/postModel');

exports.createPost = async ({ content, mediaUrl, author }) => {
  const post = new Post({ content, mediaUrl, author });
  return await post.save();
};


exports.getAllPosts = async () => {
  return await Post.find()
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
};

exports.getPostById = async (id) => {
  return await Post.findById(id).populate('author', 'name email');
};

exports.updatePost = async (id, userId, updateData) => {
  const post = await Post.findById(id);
  if (!post) throw new Error('Post not found');
  if (post.author.toString() !== userId.toString()) throw new Error('Unauthorized');

  post.content = updateData.content || post.content;
  post.mediaUrl = updateData.mediaUrl || post.mediaUrl;
  return await post.save();
};

exports.deletePost = async (id, userId) => {
  const post = await Post.findById(id);
  if (!post) throw new Error('Post not found');
  if (post.author.toString() !== userId.toString()) throw new Error('Unauthorized');

  await post.deleteOne();
};
