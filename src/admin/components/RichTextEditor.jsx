import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header", "bold", "italic", "underline", "blockquote",
  "list", "bullet", "link",
];

// Strip non-breaking spaces — they're injected by Word / Google Docs / PDF
// copy-paste and prevent the browser from wrapping text at natural points
// (causing mid-word breaks on narrow columns). Both the HTML entity
// (&nbsp;) and the literal Unicode char ( ) are converted to a
// regular space; any double-spaces left behind are collapsed.
function sanitizeNbsp(html) {
  if (!html) return html;
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/ /g, " ")
    .replace(/ {2,}/g, " ");
}

export default function RichTextEditor({ value, onChange, placeholder }) {
  const handleChange = (html) => {
    onChange?.(sanitizeNbsp(html));
  };

  return (
    <div className="bg-white border border-line rounded overflow-hidden focus-within:border-graphite">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
