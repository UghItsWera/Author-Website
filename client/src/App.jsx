import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/books" element={<Books />} />

          <Route
            path="/books/:slug"
            element={<BookDetails />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;