import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import "./AdminSeries.scss";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  coverImage: "",
};

function AdminSeries() {
  const { token } = useAuth();

  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeriesId, setEditingSeriesId] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [seriesToDelete, setSeriesToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isEditing = editingSeriesId !== null;

  const fetchSeries = async () => {
    try {
      setError("");

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingSeriesId(null);
    setFormData(initialForm);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (seriesItem) => {
    setEditingSeriesId(seriesItem.id);

    setFormData({
      name: seriesItem.name || "",
      slug: seriesItem.slug || "",
      description: seriesItem.description || "",
      coverImage: seriesItem.coverImage || "",
    });

    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingSeriesId(null);
    setFormError("");
  };

  const openDeleteConfirmation = (seriesItem) => {
    setSeriesToDelete(seriesItem);
    setDeleteError("");
  };

  const closeDeleteConfirmation = () => {
    if (isDeleting) {
      return;
    }

    setSeriesToDelete(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!seriesToDelete) {
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
        `http://localhost:5297/api/series/${seriesToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message = "Unable to delete the series.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // The server returned no JSON response.
        }

        throw new Error(message);
      }

      setSeries((current) =>
        current.filter(
          (item) => item.id !== seriesToDelete.id
        )
      );

      setSeriesToDelete(null);
    } catch (deleteRequestError) {
      setDeleteError(deleteRequestError.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Please give your series a name.");
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
        name: formData.name,
        slug: formData.slug || null,
        description: formData.description || null,
        coverImage: formData.coverImage || null,
      };

      const url = isEditing
        ? `http://localhost:5297/api/series/${editingSeriesId}`
        : "http://localhost:5297/api/series";

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
              ? "Unable to update the series."
              : "Unable to create the series.")
        );
      }

      if (isEditing) {
        setSeries((current) =>
          current.map((item) =>
            item.id === data.id ? data : item
          )
        );
      } else {
        setSeries((current) => [...current, data]);
      }

      setFormData(initialForm);
      setEditingSeriesId(null);
      setIsFormOpen(false);
    } catch (saveError) {
      setFormError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-series">
      <motion.header
        className="admin-page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <p className="admin-page-header__eyebrow">
            The collection
          </p>

          <h2>Series</h2>

          <p className="admin-page-header__description">
            Gather your stories into worlds, collections and
            connected adventures.
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

      <section className="admin-series__toolbar">
        <div>
          <p className="admin-series__count">
            {series.length}{" "}
            {series.length === 1 ? "series" : "series"}
          </p>

          <p className="admin-series__hint">
            Organise your books into connected stories
          </p>
        </div>

        <motion.button
          type="button"
          className="admin-series__add-button"
          onClick={openCreateForm}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>+</span>
          Add series
        </motion.button>
      </section>

      {isLoading && (
        <motion.div
          className="admin-series__state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="admin-series__state-ornament">
            ✦
          </span>

          <p>Opening the archives...</p>
        </motion.div>
      )}

      {!isLoading && error && (
        <motion.div
          className="admin-series__state admin-series__state--error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="admin-series__state-ornament">
            !
          </span>

          <h3>Something went wrong</h3>

          <p>{error}</p>
        </motion.div>
      )}

      {!isLoading && !error && series.length === 0 && (
        <motion.div
          className="admin-series__empty"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="admin-series__empty-ornament">
            ♢
          </div>

          <p className="admin-series__empty-eyebrow">
            An empty archive
          </p>

          <h3>No series yet.</h3>

          <p>
            Your stories can be grouped into series here. Once
            you create one, it will appear in your collection.
          </p>

          <motion.button
            type="button"
            className="admin-series__empty-button"
            onClick={openCreateForm}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>+</span>
            Create your first series
          </motion.button>
        </motion.div>
      )}

      {!isLoading && !error && series.length > 0 && (
        <motion.section
          className="admin-series__grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <AnimatePresence mode="popLayout">
            {series.map((seriesItem, index) => (
              <motion.article
                key={seriesItem.id}
                className="admin-series-card"
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
                <div className="admin-series-card__cover">
                  {seriesItem.coverImage ? (
                    <img
                      src={seriesItem.coverImage}
                      alt={`${seriesItem.name} cover`}
                    />
                  ) : (
                    <div className="admin-series-card__placeholder">
                      <span>✦</span>
                      <p>No cover</p>
                    </div>
                  )}
                </div>

                <div className="admin-series-card__content">
                  <div className="admin-series-card__top">
                    <span className="admin-series-card__label">
                      Series
                    </span>

                    <span className="admin-series-card__count">
                      {seriesItem.bookCount}{" "}
                      {seriesItem.bookCount === 1
                        ? "book"
                        : "books"}
                    </span>
                  </div>

                  <h3>{seriesItem.name}</h3>

                  {seriesItem.description && (
                    <p className="admin-series-card__description">
                      {seriesItem.description}
                    </p>
                  )}

                  <div className="admin-series-card__footer">
                    <span>
                      /{seriesItem.slug}
                    </span>

                    <div className="admin-series-card__actions">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(seriesItem)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-series-card__delete"
                        onClick={() =>
                          openDeleteConfirmation(seriesItem)
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
            className="admin-series-modal"
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
              className="admin-series-form"
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
              <div className="admin-series-form__header">
                <div>
                  <p className="admin-series-form__eyebrow">
                    {isEditing
                      ? "Edit collection"
                      : "New collection"}
                  </p>

                  <h3>
                    {isEditing
                      ? "Edit series"
                      : "Add a series"}
                  </h3>

                  <p>
                    {isEditing
                      ? "Refine the details of this collection."
                      : "Create a home for connected stories."}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-series-form__close"
                  onClick={closeForm}
                  disabled={isSaving}
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>

              <form
                className="admin-series-form__body"
                onSubmit={handleSubmit}
              >
                <div className="admin-series-form__grid">
                  <div className="admin-series-form__field admin-series-form__field--wide">
                    <label htmlFor="series-name">
                      Name <span>*</span>
                    </label>

                    <input
                      id="series-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="The name of your series"
                      required
                    />
                  </div>

                  <div className="admin-series-form__field admin-series-form__field--wide">
                    <label htmlFor="series-slug">
                      URL slug
                    </label>

                    <input
                      id="series-slug"
                      name="slug"
                      type="text"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="Leave blank to generate automatically"
                    />

                    <small>
                      This becomes part of the series website URL.
                    </small>
                  </div>

                  <div className="admin-series-form__field admin-series-form__field--wide">
                    <label htmlFor="series-cover">
                      Cover image URL
                    </label>

                    <input
                      id="series-cover"
                      name="coverImage"
                      type="url"
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="admin-series-form__field admin-series-form__field--wide">
                    <label htmlFor="series-description">
                      Description
                    </label>

                    <textarea
                      id="series-description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell readers about this collection..."
                      rows="6"
                    />
                  </div>
                </div>

                {formError && (
                  <motion.div
                    className="admin-series-form__error"
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

                <div className="admin-series-form__footer">
                  <button
                    type="button"
                    className="admin-series-form__cancel"
                    onClick={closeForm}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>

                  <motion.button
                    type="submit"
                    className="admin-series-form__submit"
                    disabled={isSaving}
                    whileHover={!isSaving ? { y: -2 } : {}}
                    whileTap={!isSaving ? { scale: 0.98 } : {}}
                  >
                    {isSaving
                      ? isEditing
                        ? "Saving collection..."
                        : "Creating collection..."
                      : isEditing
                        ? "Save changes"
                        : "Create series"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {seriesToDelete && (
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
                Remove collection
              </p>

              <h3>
                Delete "{seriesToDelete.name}"?
              </h3>

              <p className="admin-delete-dialog__message">
                The series will be removed, but its books will
                remain in your library.
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
                  Keep series
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
                    : "Delete series"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminSeries;