import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import expertRoutes from './routes/expertRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Expert Booking API is running',
    endpoints: {
      experts: '/api/experts',
      bookings: '/api/bookings'
    }
  });
});

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;