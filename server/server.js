import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for form data

// --- API Routes ---

// Auth routes (login, register)
app.use('/api/auth', authRoutes);

// Comment routes
app.use('/api/comments', commentRoutes);

// --- Error Handling ---
app.use(notFound); // 404 handler
app.use(errorHandler); // General error handler

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
