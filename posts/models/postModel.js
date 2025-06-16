// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      maxlength: [1000, 'Post cannot exceed 1000 characters'],
    },
    mediaUrl: {
      type: String,
      trim: true,
      match: [
  /^https?:\/\/.+/i,  // less strict
  'Media must be a valid URL',
],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
