import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import "./ContentDetails.scss";

function Content() {
  const { slug } = useParams();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5297/api/extracontent/${slug}`
        );

        if (response.status === 404) {
          setError("This piece of content could not be found.");
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.published) {
          setError("This piece of content is not published.");
          return;
        }

        setContent(data);
      } catch (error) {
        console.error("Content loading error:", error);
        setError(
          "Something went wrong while opening this content."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadContent();
    } else {
      setError("No content slug was provided.");
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="story-loading">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>✦</span>
          <p>Opening the manuscript...</p>
        </motion.div>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="story-not-found">
        <p className="section-eyebrow">
          The manuscript is unavailable
        </p>

        <h1>Content not found.</h1>

        <p>{error}</p>

        <Link
          to="/books"
          className="button button-primary"
        >
          Return to books
        </Link>
      </main>
    );
  }

  const publishedDate = content.publishedAt
    ? new Date(content.publishedAt).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : null;

  return (
    <main className="story-page">

      <section className="story-header">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <p className="section-eyebrow">
            {content.type}
          </p>

          <h1>{content.title}</h1>

          {content.summary && (
            <p className="story-summary">
              {content.summary}
            </p>
          )}

          <div className="story-meta">
            {content.bookTitle && (
              <span>{content.bookTitle}</span>
            )}

            {publishedDate && (
              <span>{publishedDate}</span>
            )}
          </div>
        </motion.div>
      </section>

      {content.featuredImage && (
        <motion.div
          className="story-featured-image"
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 0.15,
          }}
        >
          <img
            src={content.featuredImage}
            alt=""
          />
        </motion.div>
      )}

      <motion.article
        className="story-content"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.25,
        }}
      >
        <div
          className="story-content__body"
          dangerouslySetInnerHTML={{
            __html: content.content || "",
          }}
        />
      </motion.article>

      {content.tags && (
        <section className="story-tags">
          <span className="story-tags__label">
            Filed under
          </span>

          <div className="story-tags__list">
            {content.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
          </div>
        </section>
      )}

      <section className="story-back">
        <Link
          to="/books"
          className="text-link"
        >
          <span>←</span> Back to books
        </Link>
      </section>

    </main>
  );
}

export default Content;