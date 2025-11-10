import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useNotification();

  const unreadCount = notifications.length;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Comment System
        </Link>

        <div className="navbar-menu">
          <button
            onClick={toggleTheme}
            className="navbar-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          {isAuthenticated && (
            <div className="navbar-notification">
              <button className="navbar-notification-btn" aria-label="Notifications">
                <FiBell />
                {unreadCount > 0 && (
                  <span className="navbar-notification-badge">{unreadCount}</span>
                )}
              </button>
            </div>
          )}

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
