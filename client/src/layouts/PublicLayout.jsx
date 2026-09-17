import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PublicLayout() {
  return (
    <div className="site">
      <Navbar />

      <main className="site-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;