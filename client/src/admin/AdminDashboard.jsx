import { motion } from "framer-motion";
import "./AdminDashboard.scss";

function AdminDashboard() {
  const stats = [
    {
      label: "Books",
      value: "0",
      description: "Published and upcoming",
      icon: "♢",
    },
    {
      label: "Series",
      value: "0",
      description: "Active story worlds",
      icon: "❧",
    },
    {
      label: "Extra Content",
      value: "0",
      description: "Bonus pieces",
      icon: "✒",
    },
  ];

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

      <section className="admin-dashboard-grid">
        <motion.article
          className="admin-panel admin-panel--welcome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
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
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <div className="admin-panel__heading">
            <div>
              <p className="admin-panel__eyebrow">
                Recent activity
              </p>

              <h3>Nothing here yet</h3>
            </div>

            <span className="admin-panel__small-ornament">
              ✧
            </span>
          </div>

          <div className="admin-empty-state">
            <span>♢</span>

            <p>
              Your latest changes will appear here once you
              begin managing your website.
            </p>
          </div>
        </motion.article>
      </section>
    </div>
  );
}

export default AdminDashboard;