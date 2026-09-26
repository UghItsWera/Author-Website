import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Series.scss";

function Series() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const response = await fetch(
          "http://localhost:5297/api/series"
        );

        if (!response.ok) {
          throw new Error("Failed to load series.");
        }

        const data = await response.json();
        setSeries(data);
      } catch (error) {
        console.error("Series loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  return (
    <main className="series-page">

      {/* Header */}
      <section className="series-header">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-eyebrow">
            Worlds told across multiple pages
          </p>

          <h1>
            My <em>Series</em>
          </h1>

          <p>
            Stories that refuse to end with a single book.
            Step into the worlds and follow their stories
            from beginning to end.
          </p>
        </motion.div>
      </section>

      {/* Series */}
      <section className="series-grid-section">

        {loading ? (
          <motion.div
            className="series-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span>✦</span>
            <p>Opening the archives...</p>
          </motion.div>
        ) : series.length === 0 ? (
          <motion.div
            className="series-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>❦</span>

            <h2>
              The shelves are waiting.
            </h2>

            <p>
              No series have been added yet, but new worlds
              are waiting to be written.
            </p>

            <Link
              to="/books"
              className="text-link"
            >
              Browse my books <span>→</span>
            </Link>
          </motion.div>
        ) : (
          <div className="series-grid">
            {series.map((item, index) => (
              <motion.article
                className="series-card"
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -8,
                }}
              >
                <Link
                  to={`/series/${item.slug}`}
                  className="series-card__link"
                >

                  <div className="series-card__cover">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={`${item.name} series cover`}
                      />
                    ) : (
                      <div className="series-card__placeholder">
                        <span>Series</span>

                        <strong>
                          {item.name}
                        </strong>

                        <small>
                          {item.bookCount}{" "}
                          {item.bookCount === 1
                            ? "book"
                            : "books"}
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="series-card__content">

                    <p className="series-card__eyebrow">
                      {item.bookCount}{" "}
                      {item.bookCount === 1
                        ? "Book"
                        : "Books"}
                    </p>

                    <h2>
                      {item.name}
                    </h2>

                    {item.description && (
                      <p className="series-card__description">
                        {item.description}
                      </p>
                    )}

                    <span className="series-card__link-text">
                      Explore the series <span>→</span>
                    </span>

                  </div>

                </Link>
              </motion.article>
            ))}
          </div>
        )}

      </section>

    </main>
  );
}

export default Series;