import { Link } from "react-router-dom";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <span className="footer-title">AUTHOR</span>
          <span className="footer-subtitle">
            Stories & Worlds
          </span>
        </div>

        <div className="footer-links">
          <Link to="/books">Books</Link>
          <Link to="/series">Series</Link>
          <Link to="/content">Content</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Author Name
          </p>

          <p>
            Made with stories & a little magic.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;