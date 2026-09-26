import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.scss";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light"
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-main">AUTHOR</span>
          <span className="navbar-logo-sub">Stories & Worlds</span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/books" onClick={closeMenu}>
            Books
          </Link>

          <Link to="/series" onClick={closeMenu}>
            Series
          </Link>

          <Link to="/content" onClick={closeMenu}>
            Content
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About
          </Link>

        </nav>

        <div className="navbar-actions">

          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle colour theme"
          >
            {darkMode ? "☀" : "☾"}
          </motion.button>

          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;