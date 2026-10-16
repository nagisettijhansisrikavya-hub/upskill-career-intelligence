const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Get all chat messages for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await db.chatMessages.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) {
    console.error('Get chat error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Post a chat message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { role, content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const message = {
      _id: uuidv4(),
      userId: req.user.id,
      role: role || 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    await db.chatMessages.insert(message);
    res.status(201).json({ message });
  } catch (err) {
    console.error('Post chat error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
