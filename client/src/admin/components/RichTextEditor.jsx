import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],

    content: value || "",

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class: "rich-text-editor__content",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getHTML();

    if (value !== currentContent) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;

    const url = window.prompt(
      "Enter the URL",
      previousUrl || "https://"
    );

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  return (
    <div className="rich-text-editor">
      <div className="rich-text-editor__toolbar">
        <div className="rich-text-editor__group">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().setParagraph().run()
            }
            className={
              editor.isActive("paragraph")
                ? "is-active"
                : ""
            }
          >
            P
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 1 })
                .run()
            }
            className={
              editor.isActive("heading", { level: 1 })
                ? "is-active"
                : ""
            }
          >
            H1
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()
            }
            className={
              editor.isActive("heading", { level: 2 })
                ? "is-active"
                : ""
            }
          >
            H2
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 3 })
                .run()
            }
            className={
              editor.isActive("heading", { level: 3 })
                ? "is-active"
                : ""
            }
          >
            H3
          </button>
        </div>

        <div className="rich-text-editor__group">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            className={
              editor.isActive("bold")
                ? "is-active"
                : ""
            }
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            className={
              editor.isActive("italic")
                ? "is-active"
                : ""
            }
          >
            <em>I</em>
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            className={
              editor.isActive("underline")
                ? "is-active"
                : ""
            }
          >
            <u>U</u>
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleStrike().run()
            }
            className={
              editor.isActive("strike")
                ? "is-active"
                : ""
            }
          >
            <s>S</s>
          </button>
        </div>

        <div className="rich-text-editor__group">
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            }
            className={
              editor.isActive("bulletList")
                ? "is-active"
                : ""
            }
          >
            • List
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
            className={
              editor.isActive("orderedList")
                ? "is-active"
                : ""
            }
          >
            1. List
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBlockquote()
                .run()
            }
            className={
              editor.isActive("blockquote")
                ? "is-active"
                : ""
            }
          >
            Quote
          </button>
        </div>

        <div className="rich-text-editor__group">
          <button
            type="button"
            onClick={setLink}
            className={
              editor.isActive("link")
                ? "is-active"
                : ""
            }
          >
            Link
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setHorizontalRule()
                .run()
            }
          >
            HR
          </button>
        </div>

        <div className="rich-text-editor__group">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().undo().run()
            }
            disabled={
              !editor.can().chain().focus().undo().run()
            }
          >
            Undo
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().redo().run()
            }
            disabled={
              !editor.can().chain().focus().redo().run()
            }
          >
            Redo
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;