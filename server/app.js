import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
connectDB();

const app = express();

const whitelist = [
  'http://localhost:5173',
  'https://techzu-frontend.netlify.app',
];

// Add CLIENT_URL from .env to the whitelist if it exists
if (process.env.CLIENT_URL) {
  if (!whitelist.includes(process.env.CLIENT_URL)) {
    whitelist.push(process.env.CLIENT_URL);
  }
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("TechZu Backend server is running - API is ready!");
});

app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
