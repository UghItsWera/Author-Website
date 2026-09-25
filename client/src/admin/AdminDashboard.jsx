import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./AdminDashboard.scss";

function AdminDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [series, setSeries] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [booksResponse, seriesResponse, contentResponse] =
          await Promise.all([
            fetch("http://localhost:5297/api/books"),
            fetch("http://localhost:5297/api/series"),
            fetch("http://localhost:5297/api/extracontent"),
          ]);

        if (!booksResponse.ok || !seriesResponse.ok || !contentResponse.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        const [booksData, seriesData, contentData] = await Promise.all([
          booksResponse.json(),
          seriesResponse.json(),
          contentResponse.json(),
        ]);

        setBooks(booksData);
        setSeries(seriesData);
        setContent(contentData);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const publishedContent = content.filter((item) => item.published);
  const draftContent = content.filter((item) => !item.published);

  const recentContent = [...content]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Books",
      value: loading ? "—" : books.length,
      description: "Published and upcoming",
      icon: "♢",
    },
    {
      label: "Series",
      value: loading ? "—" : series.length,
      description: "Active story worlds",
      icon: "❧",
    },
    {
      label: "Extra Content",
      value: loading ? "—" : content.length,
      description: "Bonus pieces",
      icon: "✒",
    },
    {
      label: "Published",
      value: loading ? "—" : publishedContent.length,
      description: "Visible to readers",
      icon: "✦",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-dashboard">
      <motion.header
        className="admin-page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <p className="admin-page-header__eyebrow">
            Welcome back, author
          </p>

          <h2>Good afternoon.</h2>

          <p className="admin-page-header__description">
            Your little corner of the literary world is waiting for you.
          </p>
        </div>

        <div className="admin-page-header__ornament">
          ✦
        </div>
      </motion.header>

      <section className="admin-stats">
        {stats.map((stat, index) => (
          <motion.article
            key={stat.label}
            className="admin-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
            }}
          >
            <div className="admin-stat-card__icon">
              {stat.icon}
            </div>

            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span>{stat.description}</span>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="admin-quick-actions">
        <motion.button
          type="button"
          className="admin-quick-action"
          onClick={() => navigate("/admin/books")}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>♢</span>

          <div>
            <strong>Add a Book</strong>
            <small>Create a new book entry</small>
          </div>

          <b>→</b>
        </motion.button>

        <motion.button
          type="button"
          className="admin-quick-action"
          onClick={() => navigate("/admin/series")}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>❧</span>

          <div>
            <strong>Create a Series</strong>
            <small>Build a new story world</small>
          </div>

          <b>→</b>
        </motion.button>

        <motion.button
          type="button"
          className="admin-quick-action"
          onClick={() => navigate("/admin/content")}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>✒</span>

          <div>
            <strong>Write Content</strong>
            <small>Add a story or bonus chapter</small>
          </div>

          <b>→</b>
        </motion.button>
      </section>

      <section className="admin-dashboard-grid">
        <motion.article
          className="admin-panel admin-panel--welcome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="admin-panel__ornament">❦</span>

          <p className="admin-panel__eyebrow">
            The writing room
          </p>

          <h3>Your stories begin here.</h3>

          <p>
            Manage your books, organise your series and publish
            exclusive content for your readers from one place.
          </p>

          <div className="admin-panel__divider">
            <span>✦</span>
          </div>

          <p className="admin-panel__quote">
            Every story deserves a world of its own.
          </p>
        </motion.article>

        <motion.article
          className="admin-panel admin-panel--activity"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="admin-panel__heading">
            <div>
              <p className="admin-panel__eyebrow">
                Recent activity
              </p>

              <h3>
                {recentContent.length > 0
                  ? "Latest writing"
                  : "Nothing here yet"}
              </h3>
            </div>

            <span className="admin-panel__small-ornament">
              ✧
            </span>
          </div>

          {recentContent.length === 0 ? (
            <div className="admin-empty-state">
              <span>♢</span>

              <p>
                Your latest changes will appear here once you
                begin managing your website.
              </p>
            </div>
          ) : (
            <div className="admin-activity-list">
              {recentContent.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className="admin-activity-item"
                  onClick={() => navigate("/admin/content")}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.6 + index * 0.08,
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="admin-activity-item__icon">
                    {item.type === "Bonus Chapter" ? "❧" : "✒"}
                  </div>

                  <div className="admin-activity-item__content">
                    <strong>{item.title}</strong>

                    <span>
                      {item.type}
                      {item.bookTitle
                        ? ` · ${item.bookTitle}`
                        : ""}
                    </span>
                  </div>

                  <div className="admin-activity-item__meta">
                    <span
                      className={
                        item.published
                          ? "is-published"
                          : "is-draft"
                      }
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>

                    <small>
                      {formatDate(item.updatedAt || item.createdAt)}
                    </small>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.article>
      </section>

      {!loading && draftContent.length > 0 && (
        <motion.div
          className="admin-dashboard-note"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <span>✎</span>

          <p>
            You have <strong>{draftContent.length}</strong>{" "}
            {draftContent.length === 1 ? "piece" : "pieces"} of
            unpublished content waiting in your writing room.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/content")}
          >
            View drafts →
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default AdminDashboard;