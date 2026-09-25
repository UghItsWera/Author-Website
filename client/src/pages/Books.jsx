import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BookCard from "../components/BookCard";
import "./Books.scss";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch(
          "http://localhost:5297/api/books"
        );

        if (!response.ok) {
          throw new Error("Failed to load books.");
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Books loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return (
    <div className="books-page">

      <section className="books-header">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-eyebrow">
            Stories waiting to be told
          </p>

          <h1>
            My <em>Books</em>
          </h1>

          <p>
            Enter worlds filled with dangerous secrets,
            complicated hearts and stories that refuse to stay
            buried.
          </p>
        </motion.div>

      </section>

      <section className="books-grid-section">

        {loading ? (
          <motion.div
            className="books-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span>✦</span>
            <p>Turning the pages...</p>
          </motion.div>
        ) : books.length === 0 ? (
          <motion.div
            className="books-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>❦</span>

            <h2>
              The shelves are waiting.
            </h2>

            <p>
              No books have been added yet, but there are
              stories waiting to find their way here.
            </p>
          </motion.div>
        ) : (
          <div className="books-grid">

            {books.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                index={index}
              />
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Books;