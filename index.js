require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const roadmapRoutes = require('./routes/roadmap');
const chatRoutes = require('./routes/chat');
const mockInterviewRoutes = require('./routes/mockinterview');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mock-interviews', mockInterviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static frontend files from project root
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Explicit Error Page Routes
app.get('/404', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.get('/500', (req, res) => {
  res.status(500).sendFile(path.join(__dirname, '500.html'));
});

app.get('/403', (req, res) => {
  res.status(403).sendFile(path.join(__dirname, '403.html'));
});

// 404 Catch-All Middleware for unmatched routes
app.use((req, res) => {
  if (req.path.startsWith('/api/') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(404).json({
      error: 'Not Found',
      status: 404,
      path: req.originalUrl,
      message: 'The requested API endpoint was not found on UpSkill server.'
    });
  }
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Global 500 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  if (req.path.startsWith('/api/') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(500).json({
      error: 'Internal Server Error',
      status: 500,
      message: err.message || 'An unexpected server error occurred.'
    });
  }
  res.status(500).sendFile(path.join(__dirname, '500.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`UPSKILL running at http://localhost:${PORT}`));

