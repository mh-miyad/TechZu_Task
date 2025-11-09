MERN Comment System - Backend

This is the Node.js/Express.js backend for the MERN comment system. It provides a RESTful API for user authentication and full CRUD functionality for comments.

This backend is built with a scalable service-oriented architecture and includes robust request validation.

Features

JWT Authentication: Secure user registration and login.

Service-Oriented Architecture: Business logic is separated into a services layer, keeping controllers thin and maintainable.

Robust Validation: Uses express-validator to provide detailed, field-level error messages for all user inputs.

Comment Management: Create, read, update, and delete comments.

Like/Dislike System: Users can like or dislike comments once.

Nested Replies: Supports one-level comment replies.

Sorting: Sort comments by "newest", "most liked", or "most disliked".

Pagination: API responses for comments are paginated.

Error Handling: Custom middleware for 404 and general errors.

Validation:

Only authenticated users can post, update, delete, like, or dislike.

Only the author of a comment can update or delete it.

Folder Structure

/server
├── config/
│ └── db.js # MongoDB connection logic
├── controllers/
│ ├── authController.js # Handles req, res for auth
│ └── commentController.js # Handles req, res for comments
├── middleware/
│ ├── authMiddleware.js # JWT 'protect' middleware
│ ├── errorMiddleware.js # 404 and general error handlers
│ └── validationMiddleware.js # Handles express-validator errors
├── models/
│ ├── User.js # User schema
│ └── Comment.js # Comment schema
├── routes/
│ ├── authRoutes.js # Auth API endpoints
│ └── commentRoutes.js # Comment API endpoints
├── services/
│ ├── authService.js # Business logic for auth
│ └── commentService.js # Business logic for comments
├── utils/
│ └── generateToken.js # JWT generation utility
├── validation/
│ ├── authValidation.js # Validation rules for auth
│ └── commentValidation.js # Validation rules for comments
├── .env.example # Example environment variables
├── package.json # Project dependencies
└── server.js # Main Express server entry point

Setup and Installation

Clone the repository (or just use these files).

Navigate to the server directory:

cd server

Install dependencies:

npm install

Create .env file:
Create a .env file in the server directory. Copy the contents of .env.example and fill in your values.

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_random_string

MONGO_URI: Get this from your MongoDB Atlas cluster.

JWT_SECRET: Create a long, random, and secret string for signing tokens.

Run the server:

npm run dev

The server will start on http://localhost:5000 (or your specified PORT) and connect to your MongoDB database.

API Endpoints

Auth Routes

POST /api/auth/register

Body: { "username", "email", "password" }

Access: Public

Validation: Checks for valid email, username not empty, password >= 6 chars.

POST /api/auth/login

Body: { "email", "password" }

Access: Public

Validation: Checks for valid email, password not empty.

Comment Routes

GET /api/comments/:postSlug

Description: Get top-level comments for a post.

Query Params:

sortBy: newest (default), mostLiked, mostDisliked

page: number (default: 1)

limit: number (default: 10)

Access: Public

GET /api/comments/:id/replies

Description: Get all replies for a single comment ID.

Access: Public

POST /api/comments

Description: Create a new comment or reply.

Body: { "content", "postSlug", "parentId" } (parentId is null for a top-level comment, or the \_id of the comment you're replying to).

Access: Private (Requires auth token)

Validation: Checks for content (not empty, max 2000 chars) and postSlug (not empty).

PUT /api/comments/:id

Description: Update your own comment.

Body: { "content" }

Access: Private (Requires auth token, must be author)

Validation: Checks for content (not empty, max 2000 chars).

DELETE /api/comments/:id

Description: Delete your own comment (and its replies).

Access: Private (Requires auth token, must be author)

POST /api/comments/:id/like

Description: Like or unlike a comment.

Access: Private (Requires auth token)

POST /api/comments/:id/dislike

# Description: Dislike or remove dislike from a comment.

server/.env.example
Access: Private (Requires auth token)
This is an example. Create a real .env file with your values.

PORT=5000

Get this from your MongoDB Atlas cluster

MONGO_URI=your_mongodb_connection_string

Create a long, random, secret string for your tokens

# JWT_SECRET=your_super_secret_jwt_string

server/server.js
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
==============================
server/config/db.js
import mongoose from 'mongoose';

/\*\*

- Connects to the MongoDB database using the URI from environment variables.
  \*/
  const connectDB = async () => {
  try {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
  console.error(`Error connecting to MongoDB: ${error.message}`);
  process.exit(1); // Exit with failure
  }
  };

export default connectDB;

===================================
server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
{
username: {
type: String,
required: true,
unique: true,
},
email: {
type: String,
required: true,
unique: true,
},
password: {
type: String,
required: true,
},
// You could add avatarUrl here
avatarUrl: {
type: String,
default: 'https://placehold.co/100x100/E2E8F0/334155?text=User',
}
},
{
timestamps: true, // Adds createdAt and updatedAt
}
);

/\*\*

- Middleware: Hash password before saving a new user.
  \*/
  userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
  return next();
  }

const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});

/\*\*

- Method: Compare entered password with the hashed password in the database.
- @param {string} enteredPassword - The password to compare.
- @returns {Promise<boolean>} - True if passwords match, false otherwise.
  \*/
  userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
  };

const User = mongoose.model('User', userSchema);
export default User;
===========================
server/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
{
// Identifies what page/post the comment belongs to.
// In a real app, this might be a ref to a 'Post' model.
postSlug: {
type: String,
required: true,
index: true, // Add index for faster queries
},
content: {
type: String,
required: true,
trim: true,
maxlength: 2000,
},
author: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref: 'User', // Links to the User model
},
// For comment replies (optional feature)
parentId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Comment',
default: null, // Top-level comments have null parentId
},
likes: [
{
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
},
],
dislikes: [
{
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
},
],
// --- New Feature: Sentiment Analysis ---
sentimentScore: {
type: Number,
default: 0,
index: true, // Add index for sorting
},
},
{
timestamps: true, // Adds createdAt and updatedAt
}
);

// --- Virtuals (for efficient sorting) ---
// These aren't stored in the DB, but are calculated on query.

// Virtual for like count
commentSchema.virtual('likeCount').get(function () {
return this.likes.length;
});

// Virtual for dislike count
commentSchema.virtual('dislikeCount').get(function () {
return this.dislikes.length;
});

// Ensure virtuals are included when converting to JSON (e.g., for API responses)
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
==========================
server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/\*\*

- Middleware to protect routes.
- Verifies JWT token from the Authorization header.
- Attaches user object (without password) to req.user.
  \*/
  const protect = asyncHandler(async (req, res, next) => {
  let token;

// Check for 'Authorization' header and format 'Bearer <token>'
if (
req.headers.authorization &&
req.headers.authorization.startsWith('Bearer')
) {
try {
// Get token from header
token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token ID and attach to request object
      // .select('-password') excludes the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); // Move to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }

}

if (!token) {
res.status(401);
throw new Error('Not authorized, no token');
}
});

export { protect };

======================
server/middleware/errorMiddleware.js
/\*\*

- Middleware for handling 404 Not Found errors.
  \*/
  const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass error to the general error handler
  };

/\*\*

- General error handling middleware.
- Catches all errors passed by `next(error)`.
  \*/
  const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come in with a 200 status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

// Handle Mongoose CastError (e.g., invalid ObjectId)
if (err.name === 'CastError' && err.kind === 'ObjectId') {
statusCode = 404;
message = 'Resource not found';
}

res.status(statusCode).json({
message: message,
// Show stack trace only in development mode
stack: process.env.NODE_ENV === 'production' ? null : err.stack,
});
};

# export { notFound, errorHandler };

server/controllers/authController.js
import asyncHandler from 'express-async-handler';
import { authService } from '../services/authService.js';

/\*\*

- @desc Register a new user
- @route POST /api/auth/register
- @access Public
  \*/
  const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

try {
const userData = await authService.registerUser(username, email, password);
res.status(201).json(userData);
} catch (error) {
res.status(400); // Bad Request
throw error; // Let asyncHandler handle it
}
});

/\*\*

- @desc Auth user & get token (Login)
- @route POST /api/auth/login
- @access Public
  \*/
  const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

try {
const userData = await authService.loginUser(email, password);
res.json(userData);
} catch (error) {
res.status(401); // Unauthorized
throw error;
}
});

# export { registerUser, loginUser };

server/controllers/commentController.js
import asyncHandler from 'express-async-handler';
import { commentService } from '../services/commentService.js';
import mongoose from 'mongoose';

/\*\*

- Custom error handler for services
- Throws errors with specific status codes
  \*/
  const handleServiceError = (error, res) => {
  if (error.status) {
  res.status(error.status);
  } else {
  // Default to 400 for business logic errors
  res.status(400);
  }
  throw new Error(error.message);
  };

/\*\*

- @desc Get all comments for a post (with sorting & pagination)
- @route GET /api/comments/:postSlug
- @access Public
  \*/
  const getComments = asyncHandler(async (req, res) => {
  const { postSlug } = req.params;
  const { sortBy, page, limit } = req.query;

try {
const data = await commentService.getCommentsForPost(
postSlug,
sortBy,
page,
limit
);
res.json(data);
} catch (error) {
handleServiceError(error, res);
}
});

/\*\*

- @desc Create a new comment
- @route POST /api/comments
- @access Private
  \*/
  const createComment = asyncHandler(async (req, res) => {
  const { content, postSlug, parentId = null } = req.body;
  const authorId = req.user.\_id;

try {
const createdComment = await commentService.createNewComment(
authorId,
content,
postSlug,
parentId
);
res.status(201).json(createdComment);
} catch (error) {
handleServiceError(error, res);
}
});

/\*\*

- @desc Update a comment
- @route PUT /api/comments/:id
- @access Private
  \*/
  const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const userId = req.user.\_id;

try {
const updatedComment = await commentService.updateComment(
id,
userId,
content
);
res.json(updatedComment);
} catch (error) {
handleServiceError(error, res);
}
});

/\*\*

- @desc Delete a comment
- @route DELETE /api/comments/:id
- @access Private
  \*/
  const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.\_id;

try {
const result = await commentService.deleteComment(id, userId);
res.json(result);
} catch (error) {
handleServiceError(error, res);
}
});

/\*\*

- @desc Like a comment
- @route POST /api/comments/:id/like
- @access Private
  \*/
  const likeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.\_id;

try {
const updatedComment = await commentService.toggleLike(id, userId);
res.json(updatedComment);
} catch (error) {
handleServiceError(error, res);
}
});

/\*\*

- @desc Dislike a comment
- @route POST /api/comments/:id/dislike
- @access Private
  \*/
  const dislikeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.\_id;

try {
const updatedComment = await commentService.toggleDislike(id, userId);
res.json(updatedComment);
} catch (error) {
handleServiceError(error, res);
}
});

/\*\*

- @desc Get replies for a single comment
- @route GET /api/comments/:id/replies
- @access Public
  \*/
  const getReplies = asyncHandler(async (req, res) => {
  const { id: parentId } = req.params;

try {
const replies = await commentService.getCommentReplies(parentId);
res.json(replies);
} catch (error) {
handleServiceError(error, res);
}
});

export {
getComments,
createComment,
updateComment,
deleteComment,
likeComment,
dislikeComment,
getReplies,
};

========================
server/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import {
registerRules,
loginRules,
} from '../validation/authValidation.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// @route POST /api/auth/register
// Add validation rules. handleValidationErrors will run after rules.
router.post(
'/register',
registerRules,
handleValidationErrors,
registerUser
);

// @route POST /api/auth/login
router.post('/login', loginRules, handleValidationErrors, loginUser);

# export default router;

server/routes/commentRoutes.js
import express from 'express';
import {
getComments,
createComment,
updateComment,
deleteComment,
likeComment,
dislikeComment,
getReplies,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
createCommentRules,
updateCommentRules,
} from '../validation/commentValidation.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// --- Public Routes ---

// GET /api/comments/:postSlug
router.get('/:postSlug', getComments);

// GET /api/comments/:id/replies
router.get('/:id/replies', getReplies);

// --- Private Routes (Require Authentication) ---

// POST /api/comments
router.post(
'/',
protect,
createCommentRules,
handleValidationErrors,
createComment
);

// PUT /api/comments/:id
router.put(
'/:id',
protect,
updateCommentRules,
handleValidationErrors,
updateComment
);

// DELETE /api/comments/:id
router.delete('/:id', protect, deleteComment);

// POST /api/comments/:id/like
router.post('/:id/like', protect, likeComment);

// POST /api/comments/:id/dislike
router.post('/:id/dislike', protect, dislikeComment);

# export default router;

server/utils/generateToken.js

import jwt from 'jsonwebtoken';

/\*\*

- Generates a JSON Web Token (JWT) for a given user ID.
- @param {string} id - The user's MongoDB ObjectId.
- @returns {string} - The signed JWT.
  \*/
  const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: '30d', // Token expires in 30 days
  });
  };

# export default generateToken;

server/middleware/validationMiddleware.js
import { validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

/\*\*

- Middleware that runs validation checks.
- If errors are found, it stops the request and sends a 400 response
- with a list of errors.
  \*/
  const handleValidationErrors = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
  }
  next();
  });

# export { handleValidationErrors };

server/validation/authValidation.js
import { body } from 'express-validator';

/\*\*

- Validation rules for user registration.
  \*/
  const registerRules = [
  body('username', 'Username is required').notEmpty().trim().escape(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body(
  'password',
  'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  ];

/\*\*

- Validation rules for user login.
  \*/
  const loginRules = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
  ];

# export { registerRules, loginRules };

server/validation/commentValidation.js

import { body } from 'express-validator';

/\*\*

- Validation rules for creating a new comment.
  \*/
  const createCommentRules = [
  body('content', 'Comment content is required')
  .notEmpty()
  .trim()
  .isLength({ max: 2000 })
  .withMessage('Comment cannot be more than 2000 characters')
  .escape(),
  body('postSlug', 'postSlug is required').notEmpty().trim().escape(),
  ];

/\*\*

- Validation rules for updating a comment.
  \*/
  const updateCommentRules = [
  body('content', 'Comment content is required')
  .notEmpty()
  .trim()
  .isLength({ max: 2000 })
  .withMessage('Comment cannot be more than 2000 characters')
  .escape(),
  ];

# export { createCommentRules, updateCommentRules };

server/services/authService.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/\*\*

- Registers a new user.
- @param {string} username
- @param {string} email
- @param {string} password
- @returns {Promise<object>} { \_id, username, email, avatarUrl, token }
- @throws {Error} If user already exists or data is invalid.
  \*/
  const registerUser = async (username, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
  throw new Error('User already exists');
  }

const user = await User.create({
username,
email,
password,
});

if (user) {
return {
\_id: user.\_id,
username: user.username,
email: user.email,
avatarUrl: user.avatarUrl,
token: generateToken(user.\_id),
};
} else {
throw new Error('Invalid user data');
}
};

/\*\*

- Logs in a user.
- @param {string} email
- @param {string} password
- @returns {Promise<object>} { \_id, username, email, avatarUrl, token }
- @throws {Error} If email or password is invalid.
  \*/
  const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

if (user && (await user.matchPassword(password))) {
return {
\_id: user.\_id,
username: user.username,
email: user.email,
avatarUrl: user.avatarUrl,
token: generateToken(user.\_id),
};
} else {
throw new Error('Invalid email or password');
}
};

export const authService = {
registerUser,
loginUser,
};
=========================
server/services/commentService.js
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

/\*\*

- Gets comments for a post with sorting and pagination.
  _/
  const getCommentsForPost = async (postSlug, sortBy, page, limit) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) _ limitNum;

const query = { postSlug, parentId: null };
let sortOptions = {};

switch (sortBy) {
case 'mostLiked':
case 'mostDisliked':
// Aggregation is needed
break;
case 'newest':
default:
sortOptions = { createdAt: -1 };
break;
}

let comments;
let totalComments;

if (sortBy === 'mostLiked' || sortBy === 'mostDisliked') {
const aggregation = [
{ $match: query },
{
$addFields: {
likeCount: { $size: '$likes' },
dislikeCount: { $size: '$dislikes' },
},
},
{
$lookup: {
from: 'users',
localField: 'author',
foreignField: '_id',
as: 'authorDetails',
},
},
{ $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
{ $addFields: { author: '$authorDetails' } },
{ $project: { authorDetails: 0 } },
];

    if (sortBy === 'mostLiked') {
      aggregation.push({ $sort: { likeCount: -1, createdAt: -1 } });
    } else {
      aggregation.push({ $sort: { dislikeCount: -1, createdAt: -1 } });
    }

    const countPipeline = [...aggregation, { $count: 'total' }];
    const totalResult = await Comment.aggregate(countPipeline);
    totalComments = totalResult[0] ? totalResult[0].total : 0;

    aggregation.push({ $skip: skip });
    aggregation.push({ $limit: limitNum });

    comments = await Comment.aggregate(aggregation);

} else {
totalComments = await Comment.countDocuments(query);
comments = await Comment.find(query)
.populate('author', 'username avatarUrl')
.sort(sortOptions)
.skip(skip)
.limit(limitNum);
}

const totalPages = Math.ceil(totalComments / limitNum);
return { comments, currentPage: pageNum, totalPages, totalComments };
};

/\*\*

- Creates a new comment.
  \*/
  const createNewComment = async (authorId, content, postSlug, parentId) => {
  const comment = new Comment({
  content,
  postSlug,
  parentId: parentId || null,
  author: authorId,
  });

const createdComment = await comment.save();
await createdComment.populate('author', 'username avatarUrl');
return createdComment;
};

/\*\*

- Finds and updates a comment, checking for author ownership.
  \*/
  const updateComment = async (commentId, userId, content) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
  throw { status: 404, message: 'Comment not found' };
  }

const comment = await Comment.findById(commentId);
if (!comment) {
throw { status: 404, message: 'Comment not found' };
}

if (comment.author.toString() !== userId.toString()) {
throw { status: 401, message: 'User not authorized' };
}

comment.content = content;
const updatedComment = await comment.save();
await updatedComment.populate('author', 'username avatarUrl');
return updatedComment;
};

/\*\*

- Finds and deletes a comment, checking for author ownership.
- Also deletes all replies to that comment.
  \*/
  const deleteComment = async (commentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
  throw { status: 404, message: 'Comment not found' };
  }

const comment = await Comment.findById(commentId);
if (!comment) {
throw { status: 404, message: 'Comment not found' };
}

if (comment.author.toString() !== userId.toString()) {
throw { status: 401, message: 'User not authorized' };
}

// Delete replies first
await Comment.deleteMany({ parentId: commentId });
// Delete the main comment
await comment.deleteOne();

return { message: 'Comment and replies removed' };
};

/\*\*

- Toggles a 'like' on a comment.
- Removes dislike if it exists.
  \*/
  const toggleLike = async (commentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
  throw { status: 404, message: 'Comment not found' };
  }

const comment = await Comment.findById(commentId);
if (!comment) {
throw { status: 404, message: 'Comment not found' };
}

// 1. Remove from dislikes
comment.dislikes.pull(userId);

// 2. Toggle in likes
const hasLiked = comment.likes.includes(userId);
if (hasLiked) {
comment.likes.pull(userId);
} else {
comment.likes.addToSet(userId);
}

await comment.save();
await comment.populate('author', 'username avatarUrl');
return comment;
};

/\*\*

- Toggles a 'dislike' on a comment.
- Removes like if it exists.
  \*/
  const toggleDislike = async (commentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
  throw { status: 404, message: 'Comment not found' };
  }

const comment = await Comment.findById(commentId);
if (!comment) {
throw { status: 404, message: 'Comment not found' };
}

// 1. Remove from likes
comment.likes.pull(userId);

// 2. Toggle in dislikes
const hasDisliked = comment.dislikes.includes(userId);
if (hasDisliked) {
comment.dislikes.pull(userId);
} else {
comment.dislikes.addToSet(userId);
}

await comment.save();
await comment.populate('author', 'username avatarUrl');
return comment;
};

/\*\*

- Gets all replies for a single parent comment.
  \*/
  const getCommentReplies = async (parentId) => {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
  throw { status: 404, message: 'Comment not found' };
  }

const replies = await Comment.find({ parentId })
.populate('author', 'username avatarUrl')
.sort({ createdAt: 1 });

return replies;
};

export const commentService = {
getCommentsForPost,
createNewComment,
updateComment,
deleteComment,
toggleLike,
toggleDislike,
getCommentReplies,
};

==============
Bro, I hear you. You want to take this from a good backend to a great backend. You want it to be more professional, easier to maintain (scalable), and give the frontend developer (you!) a much better experience (user-friendly).

This is the exact right move. We'll do this by:

Adding a Service Layer: We'll move all the "business logic" (the database queries, the like/dislike logic) out of the controllers and into dedicated services. This makes your controllers super clean and thin.

Adding Robust Validation: We'll use express-validator to add powerful, field-by-field validation to your API routes. No more basic "content is required" errors. You'll get detailed error arrays, which is way more user-friendly for your React forms.

Here are the new and updated files for your more scalable and professional backend.

I'll start by creating the new files you'll need.
server/middleware/validationMiddleware.js
Nov 9, 9:26 PM

Open
server/validation/authValidation.js
Nov 9, 9:26 PM

Open
server/validation/commentValidation.js
Nov 9, 9:26 PM

Open
server/services/authService.js
Nov 9, 9:26 PM

Open
server/services/commentService.js
Nov 9, 9:26 PM

Now, I'll update your existing files to use this new scalable structure.

I've made the following changes:

Added express-validator to package.json.

Created a services directory to hold all your business logic.

Created validation and middleware/validationMiddleware.js to handle all request validation cleanly.

Refactored your controllers to be extremely thin. They now only handle the req/res objects and call the appropriate service.

Refactored your routes to include the new validation middleware.

Fixed the 44 status code typo in the dislike logic (it's now 404 inside the service).

Updated your README.md to reflect this new, more professional architecture.

This backend is now significantly more scalable and user-friendly for your frontend. When a user submits a bad login form, you won't just get "Invalid email or password"; you'll get a detailed array like [{ field: 'email', msg: 'Please include a valid email' }]. This is much better for showing errors in React.====================
