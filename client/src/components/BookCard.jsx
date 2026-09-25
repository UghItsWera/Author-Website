import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./BookCard.scss";

function BookCard({ book, index = 0 }) {
  const seriesName = book.seriesName || book.series;

  return (
    <motion.article
      className="book-card"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12
      }}
    >
      <Link
        to={`/books/${book.slug}`}
        className="book-card-link"
      >
        <motion.div
          className="book-card-cover"
          whileHover={{
            y: -10,
            rotateY: -4
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`${book.title} book cover`}
            />
          ) : (
            <div className="book-card-placeholder">
              <span>
                {seriesName || "A Novel"}
              </span>

              <strong>
                {book.title}
              </strong>

              {book.bookNumber && (
                <small>
                  Book {book.bookNumber}
                </small>
              )}
            </div>
          )}
        </motion.div>

        <div className="book-card-info">

          {seriesName && (
            <p className="book-card-series">
              {seriesName}
            </p>
          )}

          <h2>
            {book.title}
          </h2>

          {book.genre && (
            <p className="book-card-genre">
              {book.genre}
            </p>
          )}

          <p className="book-card-status">
            {book.status || "Coming Soon"}
          </p>

        </div>
      </Link>
    </motion.article>
  );
}

export default BookCard;