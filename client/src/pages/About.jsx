import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./About.scss";

const API_URL = "http://localhost:5297";

function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const response = await fetch(`${API_URL}/api/about`);

        if (!response.ok) {
          throw new Error("Failed to load About page.");
        }

        const data = await response.json();
        setAbout(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
  }, []);

  if (loading) {
    return (
      <main className="about-page about-page--loading">
        <motion.div
          className="about-page__loading-symbol"
          animate={{
            rotate: [0, 8, -8, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✦
        </motion.div>

        <p>Turning the page...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="about-page about-page--error">
        <span>✦</span>
        <h1>Something went wrong.</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <motion.div
          className="about-hero__ornament"
          initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          ✦
        </motion.div>

        <motion.p
          className="about-hero__eyebrow"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          The Author
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          About Me
        </motion.h1>

        <motion.div
          className="about-hero__line"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100px", opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        <motion.p
          className="about-hero__intro"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          {about.introduction}
        </motion.p>
      </section>

      {/* About */}
      <section className="about-content">
        <div className="about-content__inner">
          {about.profileImage && (
            <motion.div
              className="about-profile"
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
            >
              <div className="about-profile__frame">
                <img
                  src={about.profileImage}
                  alt="Portrait"
                />

                <span className="about-profile__corner about-profile__corner--tl" />
                <span className="about-profile__corner about-profile__corner--tr" />
                <span className="about-profile__corner about-profile__corner--bl" />
                <span className="about-profile__corner about-profile__corner--br" />
              </div>
            </motion.div>
          )}

          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            {about.aboutText && (
              <div className="about-text__section">
                <span className="about-text__number">01</span>

                <div>
                  <h2>A little about me</h2>

                  <div className="about-text__body">
                    {about.aboutText
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {about.writingText && (
              <div className="about-text__section">
                <span className="about-text__number">02</span>

                <div>
                  <h2>The writing</h2>

                  <div className="about-text__body">
                    {about.writingText
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="about-contact">
        <motion.div
          className="about-contact__ornament"
          initial={{ opacity: 0, rotate: -15 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          ❦
        </motion.div>

        <motion.div
          className="about-contact__content"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="about-contact__eyebrow">
            Correspondence
          </span>

          <h2>{about.contactHeading}</h2>

          {about.contactText && (
            <p>{about.contactText}</p>
          )}

          {about.email && (
            <a
              href={`mailto:${about.email}`}
              className="about-contact__email"
            >
              {about.email}
            </a>
          )}
        </motion.div>
      </section>
    </main>
  );
}

export default About;