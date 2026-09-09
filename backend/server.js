import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import Product from './models/Product.js';
import { productsData } from './data/productsData.js';
import { requestLogger } from './middleware/logger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// 1. Establish MongoDB Connection & Auto-Seed if empty
const initDB = async () => {
  await connectDB();
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log(`[Auto-Seed] Database is empty. Seeding ${productsData.length} clothing products...`);
      await Product.insertMany(productsData);
      console.log('[Auto-Seed] Initial product catalog seeded successfully.');
    } else {
      console.log(`[Database] Found ${count} existing products in database.`);
    }
  } catch (seedErr) {
    console.warn('[Auto-Seed] Notice:', seedErr.message);
  }
};

initDB();

// 2. Core Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === CORS_ORIGIN || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev permissive
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logging Middlewares
if (process.env.NODE_ENV !== 'production') {
  app.use(requestLogger);
}
app.use(morgan('dev'));

// 4. API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    service: 'House of RCR Backend API',
    phase: 'Phase 2 - Node.js + Express + MongoDB',
  });
});

// 5. Product REST API Routes
app.use('/api/products', productRoutes);

// 6. Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// 7. Start Server Listener
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 House of RCR Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🛍️  API Endpoints: http://localhost:${PORT}/api/products`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

export default app;
