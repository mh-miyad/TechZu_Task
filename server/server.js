import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.IO configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set("io", io);

// --- Socket.IO Events ---
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room for a specific post
  socket.on("joinPost", (postSlug) => {
    socket.join(postSlug);
    console.log(`Socket ${socket.id} joined post: ${postSlug}`);
  });

  // Leave a room
  socket.on("leavePost", (postSlug) => {
    socket.leave(postSlug);
    console.log(`Socket ${socket.id} left post: ${postSlug}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- API Routes ---
app.get("/", (req, res) => {
  res.send("TechZu Backend server is running API is running...");
});

// Auth routes (login, register)
app.use("/api/auth", authRoutes);

// Comment routes
app.use("/api/comments", commentRoutes);

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`WebSocket server is ready`);
});
