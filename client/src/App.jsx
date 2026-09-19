import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminBooks from "./admin/AdminBooks";
import AdminSeries from "./admin/AdminSeries";
// import AdminStories from "./admin/AdminStories";
// import AdminAbout from "./admin/AdminAbout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:slug" element={<BookDetails />} />
        </Route>

        {/* Admin login */}
<Route path="/admin/login" element={<AdminLogin />} />

{/* Protected admin area */}
  <Route element={<ProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="/admin/books" element={<AdminBooks />} />
      <Route path="/admin/series" element={<AdminSeries />} />
      {/* <Route path="/admin/stories" element={<AdminStories />} />
      <Route path="/admin/about" element={<AdminAbout />} /> */}
    </Route>
  </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;