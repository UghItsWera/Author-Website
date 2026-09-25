import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.scss";

function Home() {
  const [books, setBooks] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [booksResponse, contentResponse] = await Promise.all([
          fetch("http://localhost:5297/api/books"),
          fetch("http://localhost:5297/api/extracontent"),
        ]);

        if (!booksResponse.ok || !contentResponse.ok) {
          throw new Error("Failed to load homepage content.");
        }

        const [booksData, contentData] = await Promise.all([
          booksResponse.json(),
          contentResponse.json(),
        ]);

        setBooks(booksData);
        setContent(contentData);
      } catch (error) {
        console.error("Homepage loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const featuredBook = books
    .filter((book) => book.status !== "Archived")
    .sort((a, b) => {
      const aNumber = a.bookNumber ?? 999;
      const bNumber = b.bookNumber ?? 999;

      return aNumber - bNumber;
    })[0];

  const latestStories = content
    .filter((item) => item.published)
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt) -
        new Date(a.publishedAt || a.createdAt)
    )
    .slice(0, 3);

  const getBookStatus = (book) => {
    if (!book?.status) return "Coming soon";

    return book.status;
  };

  const getBookDescription = (book) => {
    if (!book?.description) {
      return "A story waiting to be discovered.";
    }

    return book.description;
  };

  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">

        <div className="hero-decoration hero-decoration-left">
          ❦
        </div>

        <div className="hero-decoration hero-decoration-right">
          ❧
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome to my world
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Stories of darkness,
            <br />
            <span>love & magic.</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Step into worlds where secrets linger in the shadows,
            hearts are dangerous things to possess, and every story
            has a little magic of its own.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Link to="/books" className="button button-primary">
              Explore My Books
            </Link>

            <Link to="/about" className="button button-secondary">
              Discover More
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <span>Scroll to explore</span>
          <span className="scroll-arrow">↓</span>
        </motion.div>

      </section>


      {/* Introduction */}
      <section className="intro section">

        <motion.div
          className="intro-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-eyebrow">
            A little about the author
          </p>

          <h2>
            Every story begins
            <br />
            with a single <em>idea.</em>
          </h2>

          <p>
            From quiet moments to dangerous obsessions, I write stories
            about characters who find themselves somewhere between
            what they want and what they fear.
          </p>

          <Link to="/about" className="text-link">
            Meet the author <span>→</span>
          </Link>
        </motion.div>

      </section>


      {/* Featured Book */}
      <section className="featured-book section">

        <motion.div
          className="featured-book-inner"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9 }}
        >

          <div className="featured-book-cover">
            {loading ? (
              <div className="book-placeholder">
                <span>Loading</span>
                <strong>BOOK</strong>
              </div>
            ) : featuredBook?.coverImage ? (
              <img
                src={featuredBook.coverImage}
                alt={`${featuredBook.title} cover`}
              />
            ) : (
              <div className="book-placeholder">
                <span>Featured</span>
                <strong>
                  {featuredBook?.title || "BOOK"}
                </strong>
                <small>
                  Cover Coming Soon
                </small>
              </div>
            )}
          </div>

          <div className="featured-book-content">

            <p className="section-eyebrow">
              Featured book
            </p>

            {featuredBook ? (
              <>
                <h2>
                  {featuredBook.title}
                </h2>

                <p className="book-meta">
                  {featuredBook.genre || "Novel"} ·{" "}
                  {getBookStatus(featuredBook)}
                </p>

                <p className="book-description">
                  {getBookDescription(featuredBook)}
                </p>

                <Link
                  to={`/books/${featuredBook.slug}`}
                  className="button button-primary"
                >
                  Discover the book
                </Link>
              </>
            ) : (
              <>
                <h2>
                  Something
                  <br />
                  <em>is coming.</em>
                </h2>

                <p className="book-meta">
                  First book · Coming soon
                </p>

                <p className="book-description">
                  The first story is still waiting behind the curtain.
                  Check back soon to discover what comes next.
                </p>

                <Link
                  to="/books"
                  className="button button-primary"
                >
                  Explore my books
                </Link>
              </>
            )}

          </div>

        </motion.div>

      </section>


      {/* Latest Stories */}
      <section className="latest section">

        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-eyebrow">
            From the journal
          </p>

          <h2>
            Latest <em>Stories</em>
          </h2>
        </motion.div>

        <div className="story-grid">

          {latestStories.length > 0 ? (
            latestStories.map((story, index) => (
              <motion.article
                className="story-card"
                key={story.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                whileHover={{ y: -8 }}
              >
                <span className="story-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="story-type">
                  {story.type}
                </p>

                <h3>{story.title}</h3>

                <p>
                  {story.summary ||
                    "A new piece from the writing room."}
                </p>

                <Link
                  to={`/content/${story.slug}`}
                  className="story-link"
                >
                  Read more →
                </Link>
              </motion.article>
            ))
          ) : (
            <>
              {[
                {
                  number: "01",
                  title: "The writing room",
                  description:
                    "Stories, fragments and little pieces of a world still being written.",
                },
                {
                  number: "02",
                  title: "Behind the pages",
                  description:
                    "A glimpse into the inspiration, characters and ideas behind the stories.",
                },
                {
                  number: "03",
                  title: "Coming soon",
                  description:
                    "More stories are waiting in the shadows. They will appear here soon.",
                },
              ].map((story, index) => (
                <motion.article
                  className="story-card"
                  key={story.number}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  whileHover={{ y: -8 }}
                >
                  <span className="story-number">
                    {story.number}
                  </span>

                  <h3>{story.title}</h3>

                  <p>{story.description}</p>

                  <Link
                    to="/content"
                    className="story-link"
                  >
                    Explore more →
                  </Link>
                </motion.article>
              ))}
            </>
          )}

        </div>

      </section>

    </div>
  );
}

export default Home;