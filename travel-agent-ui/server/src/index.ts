import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { redisService, UserPreferences, TripHistory } from './services/redisService.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    redis: redisService.isReady() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Get user preferences
app.get('/api/redis/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await redisService.getPreferences(userId);

    if (preferences === null) {
      res.json({ exists: false, data: null });
    } else {
      res.json({ exists: true, data: preferences });
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user preferences
app.patch('/api/redis/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences: Partial<UserPreferences> = req.body;

    const success = await redisService.updatePreferences(userId, preferences);

    if (success) {
      const updatedPrefs = await redisService.getPreferences(userId);
      res.json({
        success: true,
        message: 'Preferences updated',
        updatedFields: Object.keys(preferences),
        data: updatedPrefs
      });
    } else {
      res.status(503).json({
        success: false,
        error: 'Redis unavailable',
        message: 'Preferences not saved - Redis connection unavailable'
      });
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get all user preferences (admin/debug endpoint)
app.get('/api/redis/preferences', async (req, res) => {
  try {
    const allPreferences = await redisService.getAllPreferences();
    res.json({
      count: allPreferences.length,
      data: allPreferences
    });
  } catch (error) {
    console.error('Error fetching all preferences:', error);
    res.status(500).json({ error: 'Failed to fetch all preferences' });
  }
});

// Get user travel history
app.get('/api/redis/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await redisService.getHistory(userId);
    res.json({ data: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Add to user travel history
app.post('/api/redis/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const trip: TripHistory = req.body;

    const success = await redisService.addToHistory(userId, trip);

    if (success) {
      res.json({ success: true, message: 'Trip added to history' });
    } else {
      res.status(503).json({
        success: false,
        error: 'Redis unavailable',
        message: 'Trip not saved - Redis connection unavailable'
      });
    }
  } catch (error) {
    console.error('Error adding to history:', error);
    res.status(500).json({ error: 'Failed to add to history' });
  }
});

// Start server
async function start() {
  console.log('Starting Travel Agent Backend...');

  // Try to connect to Redis
  const redisConnected = await redisService.connect();
  if (redisConnected) {
    console.log('Redis connection established');
  } else {
    console.warn('Redis connection failed - running in degraded mode');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await redisService.disconnect();
  process.exit(0);
});

start().catch(console.error);
