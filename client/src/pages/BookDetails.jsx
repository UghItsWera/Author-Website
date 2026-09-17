import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import "./BookDetails.scss";

const books = [
  {
    id: 1,
    title: "The Emerald Heretic",
    slug: "the-emerald-heretic",
    series: "The Emerald Series",
    bookNumber: 1,
    status: "Coming Soon",
    genre: "Dark Romance",
    releaseDate: "Coming Soon",
    coverImage: null,
    description:
      "A story of dangerous secrets, complicated desire and the things people are willing to do when love becomes indistinguishable from obsession.",
    quote:
      "Some secrets are better left buried."
  },
  {
    id: 2,
    title: "Deadly Desire",
    slug: "deadly-desire",
    series: "The Emerald Series",
    bookNumber: 2,
    status: "In Progress",
    genre: "Dark Romance",
    releaseDate: "Coming Soon",
    coverImage: null,
    description:
      "The story continues as old secrets resurface and desire becomes more dangerous than ever.",
    quote:
      "Desire has always been a dangerous thing."
  },
  {
    id: 3,
    title: "The Carver",
    slug: "the-carver",
    series: null,
    bookNumber: null,
    status: "Coming Soon",
    genre: "Dark Thriller",
    releaseDate: "Coming Soon",
    coverImage: null,
    description:
      "A dark standalone story about secrets, obsession and a killer who knows exactly what people are hiding.",
    quote:
      "Everyone has something worth hiding."
  }
];

const bonusContent = [
  {
    id: 1,
    type: "Bonus Chapter",
    title: "The Night We Never Talk About",
    description:
      "An extra chapter exploring what happened when nobody was supposed to be watching.",
    available: true
  },
  {
    id: 2,
    type: "Deleted Scene",
    title: "What Could Have Been",
    description:
      "A scene that didn't quite make it into the final version of the story.",
    available: true
  },
  {
    id: 3,
    type: "Author Note",
    title: "Behind the Story",
    description:
      "A little look at the inspiration, ideas and chaos behind the book.",
    available: true
  }
];

function BookDetails() {
  const { slug } = useParams();

  const book = books.find((item) => item.slug === slug);

  if (!book) {
    return (
      <main className="book-not-found">
        <p className="section-eyebrow">The page has vanished</p>

        <h1>Book not found.</h1>

        <Link to="/books" className="button button-primary">
          Return to books
        </Link>
      </main>
    );
  }

  return (
    <div className="book-details">

      {/* Hero */}

      <section className="book-hero">

        <motion.div
          className="book-hero-cover"
          initial={{
            opacity: 0,
            x: -60,
            rotateY: 12
          }}
          animate={{
            opacity: 1,
            x: 0,
            rotateY: 0
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
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
                {book.series || "A Novel"}
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
            x: 50
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: "easeOut"
          }}
        >

          <p className="section-eyebrow">
            {book.series
              ? `${book.series}${book.bookNumber ? ` · Book ${book.bookNumber}` : ""}`
              : "Standalone Novel"}
          </p>

          <h1>{book.title}</h1>

          <p className="book-quote">
            “{book.quote}”
          </p>

          <p className="book-description">
            {book.description}
          </p>

          <div className="book-details-meta">

            <div>
              <span>Genre</span>
              <strong>{book.genre}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{book.status}</strong>
            </div>

            <div>
              <span>Release</span>
              <strong>{book.releaseDate}</strong>
            </div>

          </div>

          <div className="book-actions">

            <button className="button button-primary">
              Coming Soon
            </button>

            {book.series && (
              <Link
                to="/series"
                className="button button-secondary"
              >
                View Series
              </Link>
            )}

          </div>

        </motion.div>

      </section>


      {/* Synopsis */}

      <section className="book-synopsis">

        <motion.div
          className="book-synopsis-inner"
          initial={{
            opacity: 0,
            y: 40
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true,
            amount: 0.25
          }}
          transition={{
            duration: 0.8
          }}
        >

          <p className="section-eyebrow">
            About the book
          </p>

          <h2>
            The story <em>begins.</em>
          </h2>

          <p>
            {book.description}
          </p>

          <p>
            More of the story, characters and world-building will live
            here once the book content is connected to the database.
            This section will eventually be fully editable through
            the admin dashboard.
          </p>

        </motion.div>

      </section>


      {/* Extra Content */}

      <section className="extra-content">

        <div className="extra-content-header">

          <motion.div
            initial={{
              opacity: 0,
              y: 25
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.7
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

          {bonusContent.map((content, index) => (

            <motion.article
              className="extra-content-card"
              key={content.id}
              initial={{
                opacity: 0,
                y: 35
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                amount: 0.2
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.12
              }}
              whileHover={{
                y: -8
              }}
            >

              <span className="extra-content-type">
                {content.type}
              </span>

              <h3>
                {content.title}
              </h3>

              <p>
                {content.description}
              </p>

              <Link
                to={`/books/${book.slug}/extras/${content.id}`}
                className="text-link"
              >
                Read more <span>→</span>
              </Link>

            </motion.article>

          ))}

        </div>

      </section>


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