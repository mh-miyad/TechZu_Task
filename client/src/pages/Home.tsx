import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Welcome to Comment System</h1>
        <p>
          A modern comment system built with MERN stack featuring JWT
          authentication, real-time interactions, and advanced features.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Like & Dislike</h3>
            <p>Express your opinion on comments with likes and dislikes</p>
          </div>
          <div className="feature-card">
            <h3>Threaded Replies</h3>
            <p>Reply to comments and build engaging conversations</p>
          </div>
          <div className="feature-card">
            <h3>Smart Sorting</h3>
            <p>Sort by newest, most liked, or most disliked</p>
          </div>
        </div>

        <div className="home-actions">
          {isAuthenticated ? (
            <Link to="/comments" className="btn btn-primary btn-large">
              Go to Comments
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-large">
                Login
              </Link>
              <Link to="/register" className="btn btn-success btn-large">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
