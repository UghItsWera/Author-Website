import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Content from "./pages/Content";
import ContentDetails from "./pages/ContentDetails";
import Series from "./pages/Series";
import SeriesDetail from "./pages/SeriesDetail";
import About from "./pages/About";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminBooks from "./admin/AdminBooks";
import AdminSeries from "./admin/AdminSeries";
import AdminContent from "./admin/AdminContent";
import AdminAbout from "./admin/AdminAbout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:slug" element={<BookDetails />} />
          <Route path="/content" element={<Content />} />
          <Route path="/content/:slug" element={<ContentDetails />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series/:slug" element={<SeriesDetail />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Admin login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Protected admin area */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="books"
              element={<AdminBooks />}
            />

            <Route
              path="series"
              element={<AdminSeries />}
            />

            <Route
              path="content"
              element={<AdminContent />}
            />

            <Route
              path="about"
              element={<AdminAbout />}
            />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;