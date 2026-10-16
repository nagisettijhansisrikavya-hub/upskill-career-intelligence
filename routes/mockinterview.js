const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Get all mock interviews for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const interviews = await db.mockInterviews.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ interviews });
  } catch (err) {
    console.error('Get mock interviews error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new mock interview session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { role, questions, overallScore } = req.body;

    const interview = {
      _id: uuidv4(),
      userId: req.user.id,
      role: role || 'General',
      questions: questions || [{ question: 'Tell me about yourself.', answer: '', feedback: '', score: 0 }],
      overallScore: overallScore ?? Math.floor(60 + Math.random() * 40),
      createdAt: new Date().toISOString(),
    };

    await db.mockInterviews.insert(interview);
    res.status(201).json({ interview });
  } catch (err) {
    console.error('Create mock interview error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
