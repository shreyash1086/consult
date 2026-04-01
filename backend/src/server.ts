import app from './app';
import { connectRedis } from './config/redis';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // await connectRedis(); // Uncomment if Redis is running locally
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
