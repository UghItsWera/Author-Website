import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RichTextEditor from "./components/RichTextEditor";
import { useAuth } from "../auth/AuthContext";
import "./AdminContent.scss";

const CONTENT_TYPES = [
  "Random Story",
  "Bonus Chapter",
  "Deleted Scene",
  "Short Story",
  "Character Piece",
  "Other",
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  type: "Random Story",
  bookId: "",
  tags: "",
  summary: "",
  content: "",
  featuredImage: "",
  published: false,
};

function AdminContent() {
  const { token } = useAuth();

  const [content, setContent] = useState([]);
  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [contentResponse, booksResponse] =
        await Promise.all([
          fetch("http://localhost:5297/api/extracontent"),
          fetch("http://localhost:5297/api/books"),
        ]);

      const contentData = await contentResponse.json();
      const booksData = await booksResponse.json();

      if (!contentResponse.ok) {
        throw new Error(
          contentData.message ||
            "Unable to load extra content."
        );
      }

      if (!booksResponse.ok) {
        throw new Error(
          booksData.message ||
            "Unable to load books."
        );
      }

      setContent(contentData);
      setBooks(booksData);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((current) => ({
      ...current,
      content: value,
    }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const generateSlug = (title) => {
    return title
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      title: value,
      slug:
        editingId
          ? current.slug
          : generateSlug(value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      if (
        formData.type === "Bonus Chapter" &&
        !formData.bookId
      ) {
        throw new Error(
          "Please select a book for a bonus chapter."
        );
      }

      const payload = {
        title: formData.title,
        slug: formData.slug,
        type: formData.type,
        bookId: formData.bookId
          ? Number(formData.bookId)
          : null,
        tags: formData.tags,
        summary: formData.summary,
        content: formData.content,
        featuredImage: formData.featuredImage,
        published: formData.published,
      };

      const url = editingId
        ? `http://localhost:5297/api/extracontent/${editingId}`
        : "http://localhost:5297/api/extracontent";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save extra content."
        );
      }

      if (editingId) {
        setContent((current) =>
          current.map((item) =>
            item.id === editingId ? data : item
          )
        );

        setSuccess("Extra content updated successfully.");
      } else {
        setContent((current) => [
          data,
          ...current,
        ]);

        setSuccess("Extra content created successfully.");
      }

      resetForm();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title || "",
      slug: item.slug || "",
      type: item.type || "Random Story",
      bookId: item.bookId
        ? String(item.bookId)
        : "",
      tags: item.tags || "",
      summary: item.summary || "",
      content: item.content || "",
      featuredImage: item.featuredImage || "",
      published: item.published || false,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this piece?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5297/api/extracontent/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message ||
            "Unable to delete extra content."
        );
      }

      setContent((current) =>
        current.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="admin-content-page">
      <motion.div
        className="admin-page-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="admin-eyebrow">
            Digital Manuscript
          </span>

          <h1>
            {editingId
              ? "Edit Extra Content"
              : "Write Something"}
          </h1>

          <p>
            Create bonus chapters, side stories,
            deleted scenes and other pieces from
            your fictional universe.
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="admin-alert admin-alert--error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          className="admin-alert admin-alert--success"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {success}
        </motion.div>
      )}

      <motion.form
        className="content-editor-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <section className="content-editor-card">
          <div className="content-editor-card__header">
            <div>
              <span className="admin-eyebrow">
                Manuscript Details
              </span>

              <h2>What are you writing?</h2>
            </div>
          </div>

          <div className="content-editor-grid">
            <div className="admin-field admin-field--wide">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="The story begins..."
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="type">
                Type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                {CONTENT_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="bookId">
                Connected Book
              </label>

              <select
                id="bookId"
                name="bookId"
                value={formData.bookId}
                onChange={handleInputChange}
              >
                <option value="">
                  Standalone piece
                </option>

                {books.map((book) => (
                  <option
                    key={book.id}
                    value={String(book.id)}
                  >
                    {book.title}
                  </option>
                ))}
              </select>

              <small>
                Required for bonus chapters.
              </small>
            </div>

            <div className="admin-field admin-field--wide">
              <label htmlFor="tags">
                Tags
              </label>

              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="dark fantasy, enemies to lovers, angst"
              />

              <small>
                Separate tags with commas.
              </small>
            </div>

            <div className="admin-field admin-field--wide">
              <label htmlFor="summary">
                Summary
              </label>

              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="A short introduction to this piece..."
                rows="4"
              />
            </div>

            <div className="admin-field admin-field--wide">
              <label htmlFor="featuredImage">
                Featured Image
              </label>

              <input
                id="featuredImage"
                name="featuredImage"
                type="text"
                value={formData.featuredImage}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <section className="content-editor-card content-editor-card--writing">
          <div className="content-editor-card__header">
            <div>
              <span className="admin-eyebrow">
                The Manuscript
              </span>

              <h2>Your writing</h2>

              <p>
                This is where the actual story lives.
              </p>
            </div>
          </div>

          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
          />
        </section>

        <section className="content-editor-card">
          <div className="publish-row">
            <div>
              <span className="admin-eyebrow">
                Publication
              </span>

              <h2>
                {formData.published
                  ? "Ready for readers"
                  : "Keep it hidden"}
              </h2>

              <p>
                {formData.published
                  ? "This piece will be visible on the public website."
                  : "This piece will remain a draft."}
              </p>
            </div>

            <label className="publish-toggle">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
              />

              <span className="publish-toggle__slider" />

              <span className="publish-toggle__label">
                {formData.published
                  ? "Published"
                  : "Draft"}
              </span>
            </label>
          </div>
        </section>

        <div className="content-editor-actions">
          {editingId && (
            <button
              type="button"
              className="admin-button admin-button--secondary"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}

          <button
            type="submit"
            className="admin-button admin-button--primary"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : editingId
                ? "Save Changes"
                : "Publish Manuscript"}
          </button>
        </div>
      </motion.form>

      <section className="content-library">
        <div className="admin-page-header">
          <div>
            <span className="admin-eyebrow">
              Archive
            </span>

            <h2>Your Extra Content</h2>
          </div>
        </div>

        {isLoading ? (
          <div className="admin-loading">
            Opening the archive...
          </div>
        ) : content.length === 0 ? (
          <div className="admin-empty">
            <h3>The archive is empty.</h3>
            <p>
              Your extra stories will appear here
              once you write them.
            </p>
          </div>
        ) : (
          <div className="content-library-grid">
            {content.map((item, index) => (
              <motion.article
                className="content-library-card"
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
              >
                <div className="content-library-card__top">
                  <span className="content-type-badge">
                    {item.type}
                  </span>

                  <span
                    className={
                      item.published
                        ? "content-status content-status--published"
                        : "content-status"
                    }
                  >
                    {item.published
                      ? "Published"
                      : "Draft"}
                  </span>
                </div>

                <h3>{item.title}</h3>

                {item.summary && (
                  <p>{item.summary}</p>
                )}

                <div className="content-library-card__meta">
                  {item.bookTitle && (
                    <span>
                      {item.bookTitle}
                    </span>
                  )}

                  {item.tags && (
                    <span>
                      {item.tags}
                    </span>
                  )}
                </div>

                <div className="content-library-card__actions">
                  <button
                    type="button"
                    className="admin-button admin-button--secondary"
                    onClick={() =>
                      handleEdit(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-button admin-button--danger"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminContent;