import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Comment System
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          A modern comment system built with MERN stack featuring JWT
          authentication, real-time interactions, and advanced features.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Like & Dislike</h3>
            <p className="text-gray-600">
              Express your opinion on comments with likes and dislikes
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Threaded Replies</h3>
            <p className="text-gray-600">
              Reply to comments and build engaging conversations
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Smart Sorting</h3>
            <p className="text-gray-600">
              Sort by newest, most liked, or most disliked
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {isAuthenticated ? (
            <Link
              to="/comments"
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg"
            >
              Go to Comments
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
