import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./AdminAbout.scss";

const API_URL = "http://localhost:5297";

function AdminAbout() {
  const [form, setForm] = useState({
    profileImage: "",
    introduction: "",
    aboutText: "",
    writingText: "",
    contactHeading: "",
    contactText: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/about`);

      if (!response.ok) {
        throw new Error("Failed to load About content.");
      }

      const data = await response.json();

      setForm({
        profileImage: data.profileImage || "",
        introduction: data.introduction || "",
        aboutText: data.aboutText || "",
        writingText: data.writingText || "",
        contactHeading: data.contactHeading || "Get in touch",
        contactText: data.contactText || "",
        email: data.email || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save About content."
        );
      }

      setForm({
        profileImage: data.profileImage || "",
        introduction: data.introduction || "",
        aboutText: data.aboutText || "",
        writingText: data.writingText || "",
        contactHeading: data.contactHeading || "Get in touch",
        contactText: data.contactText || "",
        email: data.email || "",
      });

      setMessage("About page saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-about-loading">
        <motion.div
          className="admin-about-loading__ornament"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ✦
        </motion.div>

        <p>Opening the manuscript...</p>
      </div>
    );
  }

  return (
    <motion.main
      className="admin-about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="admin-about__header">
        <div>
          <span className="admin-about__eyebrow">
            Personal Archive
          </span>

          <h1>About & Contact</h1>

          <p>
            Keep the public About page up to date from one place.
          </p>
        </div>

        <div className="admin-about__header-icon">
          ✦
        </div>
      </header>

      {message && (
        <motion.div
          className="admin-about__message admin-about__message--success"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.div>
      )}

      {error && (
        <motion.div
          className="admin-about__message admin-about__message--error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <form
        className="admin-about__form"
        onSubmit={handleSubmit}
      >
        {/* ABOUT */}
        <section className="admin-about__section">
          <div className="admin-about__section-heading">
            <span>01</span>

            <div>
              <h2>About</h2>
              <p>
                The information visitors will see when they
                discover you.
              </p>
            </div>
          </div>

          <div className="admin-about__card">
            <div className="admin-about__field">
              <label htmlFor="profileImage">
                Profile Image
              </label>

              <input
                id="profileImage"
                name="profileImage"
                type="text"
                value={form.profileImage}
                onChange={handleChange}
                placeholder="/images/profile.jpg"
              />

              <small>
                Enter the image path or URL for your profile
                photograph.
              </small>
            </div>

            <div className="admin-about__field">
              <label htmlFor="introduction">
                Introduction
              </label>

              <textarea
                id="introduction"
                name="introduction"
                value={form.introduction}
                onChange={handleChange}
                placeholder="A short introduction..."
                rows="4"
              />
            </div>

            <div className="admin-about__field">
              <label htmlFor="aboutText">
                About Me
              </label>

              <textarea
                id="aboutText"
                name="aboutText"
                value={form.aboutText}
                onChange={handleChange}
                placeholder="Tell readers a little about yourself..."
                rows="7"
              />
            </div>

            <div className="admin-about__field">
              <label htmlFor="writingText">
                My Writing
              </label>

              <textarea
                id="writingText"
                name="writingText"
                value={form.writingText}
                onChange={handleChange}
                placeholder="Tell readers about your writing..."
                rows="7"
              />
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="admin-about__section">
          <div className="admin-about__section-heading">
            <span>02</span>

            <div>
              <h2>Contact</h2>
              <p>
                How readers can get in touch with you.
              </p>
            </div>
          </div>

          <div className="admin-about__card">
            <div className="admin-about__field">
              <label htmlFor="contactHeading">
                Contact Heading
              </label>

              <input
                id="contactHeading"
                name="contactHeading"
                type="text"
                value={form.contactHeading}
                onChange={handleChange}
                placeholder="Get in touch"
              />
            </div>

            <div className="admin-about__field">
              <label htmlFor="contactText">
                Contact Message
              </label>

              <textarea
                id="contactText"
                name="contactText"
                value={form.contactText}
                onChange={handleChange}
                placeholder="A short message for people who want to contact you..."
                rows="5"
              />
            </div>

            <div className="admin-about__field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hello@example.com"
              />
            </div>
          </div>
        </section>

        <div className="admin-about__actions">
          <motion.button
            type="submit"
            className="admin-about__save"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save About Page"}
          </motion.button>
        </div>
      </form>
    </motion.main>
  );
}

export default AdminAbout;