import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import "./SeriesDetail.scss";

function SeriesDetail() {
  const { slug } = useParams();

  const [series, setSeries] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSeries = async () => {
      try {
        setLoading(true);
        setError("");

        const [seriesResponse, booksResponse] = await Promise.all([
          fetch(`http://localhost:5297/api/series/${slug}`),
          fetch("http://localhost:5297/api/books"),
        ]);

        if (seriesResponse.status === 404) {
          setError("This series could not be found.");
          return;
        }

        if (!seriesResponse.ok || !booksResponse.ok) {
          throw new Error("Failed to load series.");
        }

        const [seriesData, booksData] = await Promise.all([
          seriesResponse.json(),
          booksResponse.json(),
        ]);

        const seriesBooks = booksData
          .filter((book) => book.seriesId === seriesData.id)
          .sort((a, b) => {
            const aNumber = a.bookNumber ?? 999;
            const bNumber = b.bookNumber ?? 999;

            return aNumber - bNumber;
          });

        setSeries(seriesData);
        setBooks(seriesBooks);
      } catch (error) {
        console.error("Series loading error:", error);
        setError(
          "Something went wrong while opening this series."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadSeries();
    } else {
      setError("No series slug was provided.");
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="series-detail-loading">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>✦</span>
          <p>Opening the archives...</p>
        </motion.div>
      </main>
    );
  }

  if (error || !series) {
    return (
      <main className="series-detail-not-found">
        <p className="section-eyebrow">
          The archive is unavailable
        </p>

        <h1>Series not found.</h1>

        <p>
          {error ||
            "This series could not be found in the archive."}
        </p>

        <Link
          to="/series"
          className="button button-primary"
        >
          Return to series
        </Link>
      </main>
    );
  }

  return (
    <main className="series-detail">

      {/* Hero */}
      <section className="series-detail__hero">

        <motion.div
          className="series-detail__cover"
          initial={{
            opacity: 0,
            x: -35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
          }}
        >
          {series.coverImage ? (
            <img
              src={series.coverImage}
              alt={`${series.name} series cover`}
            />
          ) : (
            <div className="series-detail__placeholder">
              <span>Series</span>

              <strong>
                {series.name}
              </strong>
            </div>
          )}
        </motion.div>

        <motion.div
          className="series-detail__intro"
          initial={{
            opacity: 0,
            x: 35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.15,
          }}
        >
          <p className="section-eyebrow">
            Series
          </p>

          <h1>{series.name}</h1>

          {series.description && (
            <p className="series-detail__description">
              {series.description}
            </p>
          )}

          <div className="series-detail__meta">
            <span>
              {series.bookCount}{" "}
              {series.bookCount === 1
                ? "book"
                : "books"}
            </span>

            <span>
              {books.length > 0
                ? `${books.length} ${
                    books.length === 1
                      ? "book"
                      : "books"
                  } currently listed`
                : "No books listed yet"}
            </span>
          </div>

          <Link
            to="/series"
            className="text-link"
          >
            <span>←</span> Back to series
          </Link>
        </motion.div>

      </section>

      {/* Books */}
      <section className="series-detail__books">

        <motion.div
          className="series-detail__heading"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <p className="section-eyebrow">
            The collection
          </p>

          <h2>
            The <em>Books</em>
          </h2>
        </motion.div>

        {books.length > 0 ? (
          <div className="series-detail__book-list">
            {books.map((book, index) => (
              <motion.article
                className="series-detail__book"
                key={book.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
              >
                <Link
                  to={`/books/${book.slug}`}
                  className="series-detail__book-link"
                >

                  <div className="series-detail__book-number">
                    {book.bookNumber
                      ? String(
                          book.bookNumber
                        ).padStart(2, "0")
                      : String(
                          index + 1
                        ).padStart(2, "0")}
                  </div>

                  <div className="series-detail__book-cover">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`${book.title} cover`}
                      />
                    ) : (
                      <div className="series-detail__book-placeholder">
                        <span>
                          {series.name}
                        </span>

                        <strong>
                          {book.title}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="series-detail__book-info">
                    <p className="series-detail__book-label">
                      Book{" "}
                      {book.bookNumber ||
                        index + 1}
                    </p>

                    <h3>
                      {book.title}
                    </h3>

                    {book.genre && (
                      <p className="series-detail__book-genre">
                        {book.genre}
                      </p>
                    )}

                    {book.description && (
                      <p className="series-detail__book-description">
                        {book.description}
                      </p>
                    )}

                    <span className="text-link">
                      Discover the book{" "}
                      <span>→</span>
                    </span>
                  </div>

                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            className="series-detail__empty"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <span>❦</span>

            <h3>
              The story is still being written.
            </h3>

            <p>
              There are no books connected to this series
              yet. Check back soon.
            </p>

            <Link
              to="/books"
              className="text-link"
            >
              Browse all books <span>→</span>
            </Link>
          </motion.div>
        )}

      </section>

    </main>
  );
}

export default SeriesDetail;