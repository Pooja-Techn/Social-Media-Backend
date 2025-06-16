// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    }
  },
  {
    timestamps: true,
  }
);

commentSchema.pre('validate', function (next) {
  if (!this.postId && !this.parentCommentId) {
    return next(new Error('Either postId or parentCommentId must be provided.'));
  }
  if (this.postId && this.parentCommentId) {
    return next(new Error('A comment can either belong to a post or another comment, not both.'));
  }
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
