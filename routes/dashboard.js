const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const [user, resume, roadmap, chatHistory, mockInterviews] = await Promise.all([
      db.users.findOne({ _id: userId }),
      db.resumes.findOne({ userId }),
      db.roadmaps.findOne({ userId }),
      db.chatMessages.find({ userId }).sort({ createdAt: 1 }),
      db.mockInterviews.find({ userId }).sort({ createdAt: -1 }),
    ]);

    res.json({
      user: user ? { id: user._id, name: user.name, email: user.email } : req.user,
      resume,
      roadmap,
      chatHistory,
      mockInterviews,
    });
  } catch (err) {
    console.error('Dashboard route error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
