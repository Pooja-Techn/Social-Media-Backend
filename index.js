// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./auth/routes/authRoutes');
const protectedRoutes = require('./auth/routes/protectedRoutes');
const connectMongoDB = require('./config/dbConfig');
const postRoutes = require('./posts/routes/postRoute');
const likeRouter = require('./likes/routes/likeRoutes');

const app = express();



app.use(cors({
  origin: 'https://one-army.netlify.app', // your frontend origin
  credentials: true
}));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// index.js (add this below the other middlewares)
app.use('/api/posts', postRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/like', likeRouter);
app.use('/api', protectedRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`,
    connectMongoDB()
));
