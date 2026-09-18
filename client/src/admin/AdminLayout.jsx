import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import "./AdminLayout.scss";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand__ornament">✦</span>

          <div>
            <p className="admin-brand__eyebrow">Author Studio</p>
            <h1>Admin</h1>
          </div>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav__label">Workspace</p>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
          >
            <span>⌂</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/books"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
          >
            <span>♢</span>
            Books
          </NavLink>

          <NavLink
            to="/admin/series"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
          >
            <span>❧</span>
            Series
          </NavLink>

          <NavLink
            to="/admin/content"
            className={({ isActive }) =>
              `admin-nav__link ${isActive ? "active" : ""}`
            }
          >
            <span>✒</span>
            Extra Content
          </NavLink>

          <p className="admin-nav__label admin-nav__label--lower">
            Website
          </p>

          <NavLink
            to="/"
            className="admin-nav__link"
          >
            <span>↗</span>
            View Website
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user">
            <div className="admin-user__avatar">W</div>

            <div>
              <strong>Administrator</strong>
              <span>Author Studio</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <motion.div
          className="admin-content"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export default AdminLayout;