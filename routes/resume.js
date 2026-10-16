const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Get user resume
router.get('/', authMiddleware, async (req, res) => {
  try {
    const resume = await db.resumes.findOne({ userId: req.user.id });
    res.json({ resume });
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload / update resume
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { fileName, fileData, parsedText, skills, skillGaps } = req.body;
    const userId = req.user.id;

    const resumeRecord = {
      userId,
      fileName: fileName || 'Resume.pdf',
      fileData: fileData || null,
      parsedText: parsedText || '',
      skills: skills || ['JavaScript', 'HTML/CSS', 'Communication'],
      skillGaps: skillGaps || ['React', 'SQL', 'Data Structures'],
      createdAt: new Date().toISOString(),
    };

    const existing = await db.resumes.findOne({ userId });
    let savedResume;

    if (existing) {
      await db.resumes.update({ userId }, { $set: resumeRecord });
      savedResume = await db.resumes.findOne({ userId });
    } else {
      savedResume = await db.resumes.insert(resumeRecord);
    }

    res.json({ resume: savedResume });
  } catch (err) {
    console.error('Save resume error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
