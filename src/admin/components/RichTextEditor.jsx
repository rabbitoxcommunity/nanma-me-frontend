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

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div className="bg-white border border-line rounded overflow-hidden focus-within:border-graphite">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
