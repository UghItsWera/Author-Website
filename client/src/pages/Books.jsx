import { motion } from "framer-motion";
import BookCard from "../components/BookCard";
import "./Books.scss";

const books = [
  {
    id: 1,
    title: "The Emerald Heretic",
    slug: "the-emerald-heretic",
    series: "The Emerald Series",
    bookNumber: 1,
    status: "Coming Soon",
    coverImage: null
  },
  {
    id: 2,
    title: "Deadly Desire",
    slug: "deadly-desire",
    series: "The Emerald Series",
    bookNumber: 2,
    status: "In Progress",
    coverImage: null
  },
  {
    id: 3,
    title: "The Carver",
    slug: "the-carver",
    series: null,
    bookNumber: null,
    status: "Coming Soon",
    coverImage: null
  }
];

function Books() {
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

        <div className="books-grid">

          {books.map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              index={index}
            />
          ))}

        </div>

      </section>

    </div>
  );
}

export default Books;