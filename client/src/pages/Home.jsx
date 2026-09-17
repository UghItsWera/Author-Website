import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.scss";

function Home() {
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
            <div className="book-placeholder">
              <span>Featured</span>
              <strong>BOOK</strong>
              <small>Cover Coming Soon</small>
            </div>
          </div>

          <div className="featured-book-content">

            <p className="section-eyebrow">
              Featured book
            </p>

            <h2>
              Your First
              <br />
              <em>Book Title</em>
            </h2>

            <p className="book-meta">
              A novel · Coming soon
            </p>

            <p className="book-description">
              A story of secrets, desire and the things we become
              when nobody is watching. Discover a world where nothing
              is quite as it seems.
            </p>

            <Link
              to="/books"
              className="button button-primary"
            >
              Discover the book
            </Link>

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

          {[
            {
              number: "01",
              title: "Behind the story",
              description:
                "A glimpse into the inspiration behind the latest novel."
            },
            {
              number: "02",
              title: "Writing after dark",
              description:
                "Thoughts, ideas and little pieces of the writing process."
            },
            {
              number: "03",
              title: "The worlds between",
              description:
                "Exploring characters, places and stories still waiting to be told."
            }
          ].map((story, index) => (

            <motion.article
              className="story-card"
              key={story.number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15
              }}
              whileHover={{ y: -8 }}
            >
              <span className="story-number">
                {story.number}
              </span>

              <h3>{story.title}</h3>

              <p>{story.description}</p>

              <Link to="/stories" className="story-link">
                Read more →
              </Link>
            </motion.article>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Home;