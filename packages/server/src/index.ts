import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3456;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0'
  });
});

// Placeholder routes
app.get('/api/projects', (_req, res) => {
  res.json({
    projects: [],
    message: 'Project discovery not yet implemented'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎼 DevPattern Dashboard API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

export { app };
