const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middleware/authMiddleware');

router.get('/home', authenticateUser, (req, res) => {
  res.json({ message: `Welcome back, ${req.user.email}` });
});

router.get('/verify-token', authenticateUser, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

module.exports = router;
