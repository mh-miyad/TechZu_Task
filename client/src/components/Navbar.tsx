import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Comment System
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <span className="navbar-welcome">Welcome, {user?.username}</span>
              <Link to="/comments" className="navbar-link">
                Comments
              </Link>
              <button onClick={logout} className="navbar-btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-btn-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
