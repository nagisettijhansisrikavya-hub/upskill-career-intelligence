const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Get user roadmap
router.get('/', authMiddleware, async (req, res) => {
  try {
    const roadmap = await db.roadmaps.findOne({ userId: req.user.id });
    res.json({ roadmap });
  } catch (err) {
    console.error('Get roadmap error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create / update roadmap
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { targetRole, milestones } = req.body;
    const userId = req.user.id;

    const roadmapRecord = {
      userId,
      targetRole: targetRole || 'Frontend Developer',
      milestones: milestones || [
        { title: 'Master JavaScript fundamentals', completed: false },
        { title: 'Learn React', completed: false },
        { title: 'Build 3 portfolio projects', completed: false },
        { title: 'Practice mock interviews', completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    const existing = await db.roadmaps.findOne({ userId });
    let savedRoadmap;

    if (existing) {
      await db.roadmaps.update({ userId }, { $set: roadmapRecord });
      savedRoadmap = await db.roadmaps.findOne({ userId });
    } else {
      savedRoadmap = await db.roadmaps.insert(roadmapRecord);
    }

    res.json({ roadmap: savedRoadmap });
  } catch (err) {
    console.error('Save roadmap error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update specific milestone
router.patch('/milestones/:index', authMiddleware, async (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    const { completed } = req.body;
    const userId = req.user.id;

    const roadmap = await db.roadmaps.findOne({ userId });
    if (!roadmap || !roadmap.milestones || !roadmap.milestones[index]) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    roadmap.milestones[index].completed = completed;
    await db.roadmaps.update({ userId }, { $set: { milestones: roadmap.milestones } });

    res.json({ roadmap });
  } catch (err) {
    console.error('Update milestone error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
