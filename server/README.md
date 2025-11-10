# MERN Comment System - Backend

Backend API for the comment system with JWT authentication.

## Features

- User authentication (register/login) with JWT
- CRUD operations for comments
- Like/Dislike functionality
- Comment replies (nested comments)
- Sorting by newest, most liked, most disliked
- Pagination support
- Real-time updates with Socket.IO (local development only)

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.IO for real-time updates
- Express Validator for input validation

## Local Development

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

3. Start development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000` with WebSocket support.

## Netlify Deployment

### Prerequisites

- Netlify account
- MongoDB Atlas account (for cloud database)
- Netlify CLI installed: `npm install -g netlify-cli`

### Deployment Steps

1. **Prepare Environment Variables**

   In your Netlify dashboard, add these environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CLIENT_URL`: Your frontend Netlify URL
   - `NODE_ENV`: production

2. **Deploy with Netlify CLI**

   ```bash
   # Login to Netlify
   netlify login

   # Initialize Netlify site
   netlify init

   # Deploy
   netlify deploy --prod
   ```

3. **Or Deploy via Git**

   - Connect your GitHub repository to Netlify
   - Netlify will automatically deploy when you push to main branch

### Important Notes for Netlify

- **WebSocket/Socket.IO**: Real-time features using Socket.IO will NOT work on Netlify Functions as they are serverless. The app will still function, but users won't see real-time updates.
- **Function Timeout**: Netlify Functions have a 10-second timeout by default (26 seconds on Pro plans)
- **Cold Starts**: First request after inactivity may be slower due to cold start

### Alternative for Real-Time Features

If you need real-time updates on Netlify, consider:
1. Using a separate WebSocket service (Pusher, Ably, etc.)
2. Deploying the full server on Heroku, Railway, or DigitalOcean
3. Using polling instead of WebSockets

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Comments
- `GET /api/comments/:postSlug` - Get comments for a post
- `POST /api/comments` - Create comment (authenticated)
- `PUT /api/comments/:id` - Update comment (authenticated)
- `DELETE /api/comments/:id` - Delete comment (authenticated)
- `POST /api/comments/:id/like` - Like comment (authenticated)
- `POST /api/comments/:id/dislike` - Dislike comment (authenticated)
- `GET /api/comments/:id/replies` - Get comment replies

## Project Structure

```
server/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Auth logic
│   └── commentController.js  # Comment logic
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   ├── errorMiddleware.js    # Error handling
│   └── validationMiddleware.js
├── models/
│   ├── User.js              # User model
│   └── Comment.js           # Comment model
├── routes/
│   ├── authRoutes.js        # Auth routes
│   └── commentRoutes.js     # Comment routes
├── services/
│   ├── authService.js       # Auth business logic
│   └── commentService.js    # Comment business logic
├── validation/
│   ├── authValidation.js    # Auth validation rules
│   └── commentValidation.js # Comment validation rules
├── netlify/
│   └── functions/
│       └── api.js           # Netlify function wrapper
├── app.js                   # Express app (for Netlify)
├── server.js                # Server with Socket.IO (local dev)
└── netlify.toml            # Netlify configuration
```

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add database user with password
4. Whitelist all IPs (0.0.0.0/0) for Netlify access
5. Get connection string and add to environment variables

## Security Notes

- Always use strong JWT_SECRET
- Never commit `.env` file
- Use MongoDB Atlas with proper security rules
- Enable CORS only for your frontend domain in production
- Keep dependencies updated

## Troubleshooting

### Database Connection Issues
- Check MongoDB Atlas whitelist (use 0.0.0.0/0 for Netlify)
- Verify connection string format
- Ensure user credentials are correct

### Function Timeout on Netlify
- Optimize database queries
- Add indexes to MongoDB collections
- Consider upgrading to Netlify Pro for longer timeout

### CORS Errors
- Update CLIENT_URL environment variable
- Check CORS configuration in app.js

## License

MIT
