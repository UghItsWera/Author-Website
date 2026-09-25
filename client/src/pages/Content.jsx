import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Content.scss";

function ContentIndex() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(
          "http://localhost:5297/api/extracontent"
        );

        if (!response.ok) {
          throw new Error("Failed to load content.");
        }

        const data = await response.json();

        setContent(
          data
            .filter((item) => item.published)
            .sort(
              (a, b) =>
                new Date(b.publishedAt || b.createdAt) -
                new Date(a.publishedAt || a.createdAt)
            )
        );
      } catch (error) {
        console.error("Content loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <main className="content-index">

      <section className="content-index__header">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-eyebrow">
            From the writing room
          </p>

          <h1>
            Extra <em>Content</em>
          </h1>

          <p>
            Stories, hidden scenes, character pieces and little
            fragments from the worlds behind the books.
          </p>
        </motion.div>
      </section>

      <section className="content-index__grid">

        {loading ? (
          <motion.div
            className="content-index__loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span>✦</span>
            <p>Opening the archive...</p>
          </motion.div>
        ) : content.length === 0 ? (
          <motion.div
            className="content-index__empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>❦</span>

            <h2>
              The archive is quiet.
            </h2>

            <p>
              There are no published pieces here yet.
              Check back soon for stories beyond the pages.
            </p>
          </motion.div>
        ) : (
          content.map((item, index) => (
            <motion.article
              className="content-card"
              key={item.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
              }}
            >
              {item.featuredImage && (
                <div className="content-card__image">
                  <img
                    src={item.featuredImage}
                    alt=""
                  />
                </div>
              )}

              <div className="content-card__body">

                <p className="content-card__type">
                  {item.type}
                </p>

                <h2>
                  {item.title}
                </h2>

                {item.bookTitle && (
                  <p className="content-card__book">
                    {item.bookTitle}
                  </p>
                )}

                <p className="content-card__summary">
                  {item.summary ||
                    "A little something beyond the pages."}
                </p>

                <Link
                  to={`/content/${item.slug}`}
                  className="text-link"
                >
                  Read more <span>→</span>
                </Link>

              </div>
            </motion.article>
          ))
        )}

      </section>

    </main>
  );
}

export default ContentIndex;