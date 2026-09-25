import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import "./BookDetails.scss";

function BookDetails() {
  const { slug } = useParams();

  const [book, setBook] = useState(null);
  const [extraContent, setExtraContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const [bookResponse, contentResponse] = await Promise.all([
          fetch(`http://localhost:5297/api/books/${slug}`),
          fetch("http://localhost:5297/api/extracontent"),
        ]);

        if (bookResponse.status === 404) {
          setNotFound(true);
          return;
        }

        if (!bookResponse.ok || !contentResponse.ok) {
          throw new Error("Failed to load book.");
        }

        const [bookData, contentData] = await Promise.all([
          bookResponse.json(),
          contentResponse.json(),
        ]);

        setBook(bookData);

        const relatedContent = contentData.filter(
          (item) =>
            item.bookId === bookData.id &&
            item.published
        );

        setExtraContent(relatedContent);
      } catch (error) {
        console.error("Book loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [slug]);

  if (loading) {
    return (
      <main className="book-details-loading">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span>✦</span>
          <p>Turning the pages...</p>
        </motion.div>
      </main>
    );
  }

  if (notFound || !book) {
    return (
      <main className="book-not-found">
        <p className="section-eyebrow">
          The page has vanished
        </p>

        <h1>Book not found.</h1>

        <Link
          to="/books"
          className="button button-primary"
        >
          Return to books
        </Link>
      </main>
    );
  }

  const seriesName = book.seriesName || book.series;

  const releaseDate = book.releaseDate
    ? new Date(book.releaseDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Coming Soon";

  return (
    <div className="book-details">

      {/* Hero */}

      <section className="book-hero">

        <motion.div
          className="book-hero-cover"
          initial={{
            opacity: 0,
            x: -60,
            rotateY: 12,
          }}
          animate={{
            opacity: 1,
            x: 0,
            rotateY: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`${book.title} book cover`}
            />
          ) : (
            <div className="book-detail-placeholder">

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

        <motion.div
          className="book-hero-content"
          initial={{
            opacity: 0,
            x: 50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: "easeOut",
          }}
        >

          <p className="section-eyebrow">
            {seriesName
              ? `${seriesName}${
                  book.bookNumber
                    ? ` · Book ${book.bookNumber}`
                    : ""
                }`
              : "Standalone Novel"}
          </p>

          <h1>{book.title}</h1>

          {book.description && (
            <p className="book-description">
              {book.description}
            </p>
          )}

          <div className="book-details-meta">

            <div>
              <span>Genre</span>

              <strong>
                {book.genre || "Unspecified"}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong>
                {book.status || "Coming Soon"}
              </strong>
            </div>

            <div>
              <span>Release</span>

              <strong>
                {releaseDate}
              </strong>
            </div>

          </div>

          <div className="book-actions">

            {book.purchaseUrl ? (
              <a
                href={book.purchaseUrl}
                target="_blank"
                rel="noreferrer"
                className="button button-primary"
              >
                Where to buy
              </a>
            ) : (
              <span className="button button-primary">
                Coming Soon
              </span>
            )}

            <Link
              to="/books"
              className="button button-secondary"
            >
              All Books
            </Link>

          </div>

        </motion.div>

      </section>


      {/* Synopsis */}

      <section className="book-synopsis">

        <motion.div
          className="book-synopsis-inner"
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
          }}
        >

          <p className="section-eyebrow">
            About the book
          </p>

          <h2>
            The story <em>begins.</em>
          </h2>

          <p>
            {book.description ||
              "More details about this story will appear here soon."}
          </p>

        </motion.div>

      </section>


      {/* Extra Content */}

      {extraContent.length > 0 && (
        <section className="extra-content">

          <div className="extra-content-header">

            <motion.div
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
                Beyond the pages
              </p>

              <h2>
                Extra <em>Content</em>
              </h2>

              <p>
                Step a little deeper into the world of the story.
                Discover bonus material, hidden scenes and little
                pieces that exist beyond the published book.
              </p>

            </motion.div>

          </div>

          <div className="extra-content-grid">

            {extraContent.map((content, index) => (

              <motion.article
                className="extra-content-card"
                key={content.id}
                initial={{
                  opacity: 0,
                  y: 35,
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
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -8,
                }}
              >

                <span className="extra-content-type">
                  {content.type}
                </span>

                <h3>
                  {content.title}
                </h3>

                <p>
                  {content.summary ||
                    "A little something beyond the pages."}
                </p>

                <Link
                  to={`/content/${content.slug}`}
                  className="text-link"
                >
                  Read more <span>→</span>
                </Link>

              </motion.article>

            ))}

          </div>

        </section>
      )}


      {/* Back */}

      <section className="book-back">

        <Link
          to="/books"
          className="text-link"
        >
          <span>←</span> Back to all books
        </Link>

      </section>

    </div>
  );
}

export default BookDetails;