import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import chatRoutes from './routes/chat.js';
import healthRoutes from './routes/health.js';
import notionService from './services/notionService.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://mangalam-bot.vercel.app/',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Health check root route
app.get('/', (req, res) => {
  res.send('College Chatbot backend is running!');
});
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api', chatRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize Notion data sync
async function initializeApp() {
  try {
    console.log('🚀 Starting college chatbot server...');
    await notionService.syncNotionData();
    console.log('✅ Initial Notion data sync completed');
    
    app.listen(PORT, () => {
      console.log(`🌟 Server running on port ${PORT}`);
      console.log(`📚 College chatbot ready to serve students!`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize server:', error.message);
    process.exit(1);
  }
}

initializeApp();