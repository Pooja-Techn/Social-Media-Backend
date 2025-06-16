// seeder.js
const mongoose = require('mongoose');
// utils/seeder.js
const { fakerEN } = require('@faker-js/faker');
const faker = fakerEN; // optional alias for cleaner usage

console.log('faker.helpers:', faker.helpers); // check if it's undefined

// Now this will work
const category = faker.helpers.arrayElement(['Tech', 'Agri', 'Mfg']);
console.log('Sample category:', category);


const bcrypt = require('bcrypt');

// Models
const User = require('../auth/models/Users');
const Post = require('../posts/models/postModel');
const Comment = require('../comments/models/comment');
const Like = require('../likes//models/likes');
const Follow = require('../follows/models/follow');

// Connect DB
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/authApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB Connected');
};

// Seed function
const seed = async () => {
  try {
    await connectDB();

    // Clear collections
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();
    await Follow.deleteMany();

    // Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [];

    for (let i = 0; i < 5; i++) {
      users.push(await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
      }));
    }

    // Posts
    const posts = [];
    for (let i = 0; i < 10; i++) {
      const user = faker.helpers.arrayElement(users);
      // Generate a valid image or video URL for mediaUrl
      let mediaUrl = '';
      if (faker.datatype.boolean()) {
        // Use a simple, valid image URL
        mediaUrl = faker.image.urlPicsumPhotos();
      }
      posts.push(await Post.create({
        content: faker.lorem.sentence(),
        mediaUrl,
        author: user._id,
      }));
    }

    // Comments (some on posts, some on comments)
    const comments = [];
    for (let i = 0; i < 10; i++) {
      const user = faker.helpers.arrayElement(users);
      if (i < 5) {
        // Comment on post
        comments.push(await Comment.create({
          content: faker.lorem.sentences(2),
          postId: faker.helpers.arrayElement(posts)._id,
          author: user._id,
        }));
      } else {
        // Comment on comment
        comments.push(await Comment.create({
          content: faker.lorem.sentences(2),
          parentCommentId: faker.helpers.arrayElement(comments)._id,
          author: user._id,
        }));
      }
    }

    // Likes
    const likeSet = new Set();

for (let i = 0; i < 10; i++) {
  const user = faker.helpers.arrayElement(users);
  const isPostLike = faker.datatype.boolean();

  const targetList = isPostLike ? posts : comments;
  const targetType = isPostLike ? 'Post' : 'Comment';
  const target = faker.helpers.arrayElement(targetList);

  const key = `${user._id}_${targetType}_${target._id}`;
  
  if (likeSet.has(key)) {
    i--; // retry this iteration with a different random pair
    continue;
  }

  likeSet.add(key);

  const like = new Like({
    user: user._id,
    targetType,
    targetId: target._id,
  });

  await like.save();
}


    // Follows
    for (let i = 0; i < 5; i++) {
      const follower = faker.helpers.arrayElement(users);
      let following;
      do {
        following = faker.helpers.arrayElement(users);
      } while (follower._id.equals(following._id));

      await Follow.create({
        follower: follower._id,
        following: following._id,
      });
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
