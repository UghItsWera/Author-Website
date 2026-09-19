import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import "./AdminBooks.scss";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  coverImage: "",
  releaseDate: "",
  status: "Coming Soon",
  genre: "",
  bookNumber: "",
  seriesId: "",
  purchaseUrl: "",
};

function AdminBooks() {
  const { token } = useAuth();

  const [books, setBooks] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isEditing = editingBookId !== null;

  const fetchBooks = async () => {
    try {
      setError("");

      const response = await fetch(
        "http://localhost:5297/api/books"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load books."
        );
      }

      setBooks(data);
    } catch (fetchError) {
      setError(fetchError.message);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await fetch(
        "http://localhost:5297/api/series"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load series."
        );
      }

      setSeries(data);
    } catch (fetchError) {
      setError(fetchError.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      await Promise.all([
        fetchBooks(),
        fetchSeries(),
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const getSeriesName = (seriesId) => {
    if (!seriesId) {
      return "Standalone";
    }

    const matchingSeries = series.find(
      (item) => item.id === seriesId
    );

    return matchingSeries?.name || "Standalone";
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingBookId(null);
    setFormData(initialForm);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (book) => {
    setEditingBookId(book.id);

    setFormData({
      title: book.title || "",
      slug: book.slug || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      releaseDate: book.releaseDate
        ? book.releaseDate.slice(0, 10)
        : "",
      status: book.status || "Coming Soon",
      genre: book.genre || "",
      bookNumber: book.bookNumber
        ? String(book.bookNumber)
        : "",
      seriesId: book.seriesId
        ? String(book.seriesId)
        : "",
      purchaseUrl: book.purchaseUrl || "",
    });

    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingBookId(null);
    setFormError("");
  };

  const openDeleteConfirmation = (book) => {
    setBookToDelete(book);
    setDeleteError("");
  };

  const closeDeleteConfirmation = () => {
    if (isDeleting) {
      return;
    }

    setBookToDelete(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!bookToDelete) {
      return;
    }

    if (!token) {
      setDeleteError(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `http://localhost:5297/api/books/${bookToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message = "Unable to delete the book.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // The server returned no JSON response.
        }

        throw new Error(message);
      }

      setBooks((current) =>
        current.filter(
          (book) => book.id !== bookToDelete.id
        )
      );

      setBookToDelete(null);
    } catch (deleteRequestError) {
      setDeleteError(deleteRequestError.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Please give your book a title.");
      return;
    }

    if (!token) {
      setFormError(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    setIsSaving(true);

    try {
      const requestBody = {
        title: formData.title,
        slug: formData.slug || null,
        description: formData.description || null,
        coverImage: formData.coverImage || null,
        releaseDate: formData.releaseDate
          ? new Date(formData.releaseDate).toISOString()
          : null,
        status: formData.status,
        genre: formData.genre || null,
        bookNumber: formData.bookNumber
          ? Number(formData.bookNumber)
          : null,
        seriesId: formData.seriesId
          ? Number(formData.seriesId)
          : null,
        purchaseUrl: formData.purchaseUrl || null,
      };

      const url = isEditing
        ? `http://localhost:5297/api/books/${editingBookId}`
        : "http://localhost:5297/api/books";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Unable to update the book."
              : "Unable to create the book.")
        );
      }

      if (isEditing) {
        setBooks((current) =>
          current.map((book) =>
            book.id === data.id ? data : book
          )
        );
      } else {
        setBooks((current) => [...current, data]);
      }

      setFormData(initialForm);
      setEditingBookId(null);
      setIsFormOpen(false);
    } catch (saveError) {
      setFormError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-books">
      <motion.header
        className="admin-page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <p className="admin-page-header__eyebrow">
            The library
          </p>

          <h2>Books</h2>

          <p className="admin-page-header__description">
            Create, organise and manage the stories that make up
            your literary world.
          </p>
        </div>

        <motion.div
          className="admin-page-header__ornament"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ♢
        </motion.div>
      </motion.header>

      <section className="admin-books__toolbar">
        <div>
          <p className="admin-books__count">
            {books.length}{" "}
            {books.length === 1 ? "book" : "books"}
          </p>

          <p className="admin-books__hint">
            Your published and upcoming works
          </p>
        </div>

        <motion.button
          type="button"
          className="admin-books__add-button"
          onClick={openCreateForm}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>+</span>
          Add book
        </motion.button>
      </section>

      {isLoading && (
        <motion.div
          className="admin-books__state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="admin-books__state-ornament">
            ✦
          </span>

          <p>Opening the manuscript...</p>
        </motion.div>
      )}

      {!isLoading && error && (
        <motion.div
          className="admin-books__state admin-books__state--error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="admin-books__state-ornament">
            !
          </span>

          <h3>Something went wrong</h3>

          <p>{error}</p>
        </motion.div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <motion.div
          className="admin-books__empty"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="admin-books__empty-ornament">
            ♢
          </div>

          <p className="admin-books__empty-eyebrow">
            An empty bookshelf
          </p>

          <h3>No books yet.</h3>

          <p>
            Your literary collection is waiting for its first
            story. Once you add a book, it will appear here.
          </p>

          <motion.button
            type="button"
            className="admin-books__empty-button"
            onClick={openCreateForm}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>+</span>
            Add your first book
          </motion.button>
        </motion.div>
      )}

      {!isLoading && !error && books.length > 0 && (
        <motion.section
          className="admin-books__grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <AnimatePresence mode="popLayout">
            {books.map((book, index) => (
              <motion.article
                key={book.id}
                className="admin-book-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: -10,
                  transition: {
                    duration: 0.25,
                  },
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -4 }}
                layout
              >
                <div className="admin-book-card__cover">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={`${book.title} cover`}
                    />
                  ) : (
                    <div className="admin-book-card__placeholder">
                      <span>✦</span>
                      <p>No cover</p>
                    </div>
                  )}
                </div>

                <div className="admin-book-card__content">
                  <div className="admin-book-card__top">
                    <span className="admin-book-card__status">
                      {book.status}
                    </span>

                    {book.bookNumber && (
                      <span className="admin-book-card__number">
                        Book {book.bookNumber}
                      </span>
                    )}
                  </div>

                  <h3>{book.title}</h3>

                  {book.genre && (
                    <p className="admin-book-card__genre">
                      {book.genre}
                    </p>
                  )}

                  {book.description && (
                    <p className="admin-book-card__description">
                      {book.description}
                    </p>
                  )}

                  <div className="admin-book-card__footer">
                    <span>
                      {getSeriesName(book.seriesId)}
                    </span>

                    <div className="admin-book-card__actions">
                      <button
                        type="button"
                        onClick={() => openEditForm(book)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-book-card__delete"
                        onClick={() =>
                          openDeleteConfirmation(book)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.section>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="admin-book-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeForm();
              }
            }}
          >
            <motion.div
              className="admin-book-form"
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <div className="admin-book-form__header">
                <div>
                  <p className="admin-book-form__eyebrow">
                    {isEditing
                      ? "Edit manuscript"
                      : "New manuscript"}
                  </p>

                  <h3>
                    {isEditing
                      ? "Edit book"
                      : "Add a book"}
                  </h3>

                  <p>
                    {isEditing
                      ? "Refine the details of this story."
                      : "Give your next story a place in the library."}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-book-form__close"
                  onClick={closeForm}
                  disabled={isSaving}
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>

              <form
                className="admin-book-form__body"
                onSubmit={handleSubmit}
              >
                <div className="admin-book-form__grid">
                  <div className="admin-book-form__field admin-book-form__field--wide">
                    <label htmlFor="title">
                      Title <span>*</span>
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="The title of your book"
                      required
                    />
                  </div>

                  <div className="admin-book-form__field">
                    <label htmlFor="status">
                      Status
                    </label>

                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Coming Soon">
                        Coming Soon
                      </option>
                      <option value="Upcoming">
                        Upcoming
                      </option>
                      <option value="Published">
                        Published
                      </option>
                      <option value="Draft">
                        Draft
                      </option>
                    </select>
                  </div>

                  <div className="admin-book-form__field">
                    <label htmlFor="genre">
                      Genre
                    </label>

                    <input
                      id="genre"
                      name="genre"
                      type="text"
                      value={formData.genre}
                      onChange={handleInputChange}
                      placeholder="Dark fantasy, romance..."
                    />
                  </div>

                  <div className="admin-book-form__field">
                    <label htmlFor="bookNumber">
                      Book number
                    </label>

                    <input
                      id="bookNumber"
                      name="bookNumber"
                      type="number"
                      min="1"
                      value={formData.bookNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 1"
                    />
                  </div>

                  <div className="admin-book-form__field">
                    <label htmlFor="releaseDate">
                      Release date
                    </label>

                    <input
                      id="releaseDate"
                      name="releaseDate"
                      type="date"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-book-form__field">
                    <label htmlFor="seriesId">
                      Series
                    </label>

                    <select
                      id="seriesId"
                      name="seriesId"
                      value={formData.seriesId}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        Standalone book
                      </option>

                      {series.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>

                    <small>
                      Choose a series or leave this as standalone.
                    </small>
                  </div>

                  <div className="admin-book-form__field admin-book-form__field--wide">
                    <label htmlFor="slug">
                      URL slug
                    </label>

                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="Leave blank to generate automatically"
                    />

                    <small>
                      This becomes part of the book's website URL.
                    </small>
                  </div>

                  <div className="admin-book-form__field admin-book-form__field--wide">
                    <label htmlFor="coverImage">
                      Cover image URL
                    </label>

                    <input
                      id="coverImage"
                      name="coverImage"
                      type="url"
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="admin-book-form__field admin-book-form__field--wide">
                    <label htmlFor="purchaseUrl">
                      Purchase URL
                    </label>

                    <input
                      id="purchaseUrl"
                      name="purchaseUrl"
                      type="url"
                      value={formData.purchaseUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="admin-book-form__field admin-book-form__field--wide">
                    <label htmlFor="description">
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell readers what this story is about..."
                      rows="6"
                    />
                  </div>
                </div>

                {formError && (
                  <motion.div
                    className="admin-book-form__error"
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <span>!</span>
                    {formError}
                  </motion.div>
                )}

                <div className="admin-book-form__footer">
                  <button
                    type="button"
                    className="admin-book-form__cancel"
                    onClick={closeForm}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>

                  <motion.button
                    type="submit"
                    className="admin-book-form__submit"
                    disabled={isSaving}
                    whileHover={!isSaving ? { y: -2 } : {}}
                    whileTap={!isSaving ? { scale: 0.98 } : {}}
                  >
                    {isSaving
                      ? isEditing
                        ? "Saving manuscript..."
                        : "Writing manuscript..."
                      : isEditing
                        ? "Save changes"
                        : "Create book"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookToDelete && (
          <motion.div
            className="admin-delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeDeleteConfirmation();
              }
            }}
          >
            <motion.div
              className="admin-delete-dialog"
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 15,
                scale: 0.97,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <div className="admin-delete-dialog__ornament">
                !
              </div>

              <p className="admin-delete-dialog__eyebrow">
                Remove manuscript
              </p>

              <h3>Delete "{bookToDelete.title}"?</h3>

              <p className="admin-delete-dialog__message">
                This will permanently remove this book from your
                library. This action cannot be undone.
              </p>

              {deleteError && (
                <motion.div
                  className="admin-delete-dialog__error"
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <span>!</span>
                  {deleteError}
                </motion.div>
              )}

              <div className="admin-delete-dialog__actions">
                <button
                  type="button"
                  className="admin-delete-dialog__cancel"
                  onClick={closeDeleteConfirmation}
                  disabled={isDeleting}
                >
                  Keep book
                </button>

                <motion.button
                  type="button"
                  className="admin-delete-dialog__confirm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  whileHover={!isDeleting ? { y: -2 } : {}}
                  whileTap={!isDeleting ? { scale: 0.98 } : {}}
                >
                  {isDeleting
                    ? "Removing..."
                    : "Delete book"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminBooks;