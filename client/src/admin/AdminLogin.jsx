import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import "./AdminLogin.scss";

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await login(username, password);

      navigate("/admin");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <motion.div
        className="admin-login__card"
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <motion.div
          className="admin-login__ornament"
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          ✦
        </motion.div>

        <p className="admin-login__eyebrow">
          Author Studio
        </p>

        <h1>Welcome back.</h1>

        <p className="admin-login__intro">
          Enter your credentials to return to the writing room.
        </p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__field">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="Your username"
              required
            />
          </div>

          <div className="admin-login__field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Your password"
              required
            />
          </div>

          {error && (
            <motion.p
              className="admin-login__error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="admin-login__button"
            disabled={isLoading}
            whileHover={!isLoading ? { y: -2 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading
              ? "Entering..."
              : "Enter the writing room"}
          </motion.button>
        </form>

        <div className="admin-login__divider">
          <span>✦</span>
        </div>

        <Link
          to="/"
          className="admin-login__return"
        >
          ← Return to website
        </Link>
      </motion.div>
    </main>
  );
}

export default AdminLogin;