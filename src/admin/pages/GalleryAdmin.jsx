import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiImage, FiYoutube, FiTrash2, FiUpload, FiSearch, FiX,
  FiPlus, FiEdit3, FiCheck, FiExternalLink, FiFilm, FiHome,
} from "react-icons/fi";
import { galleryApi } from "../api/endpoints";
import { PageHeader, Button, Input, Select, EmptyState, Toggle } from "../components/ui";
import { useToast } from "../components/Toast";
import { useConfirm } from "../components/ConfirmDialog";
import { getYouTubeThumb } from "../../utils/youtube";

// ─── Constants ──────────────────────────────────────
const CATEGORIES = [
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
  { value: "amenities", label: "Amenities" },
  { value: "video", label: "Video / Film" },
  { value: "other", label: "Other" },
];

const FILTER_OPTIONS = [
  { value: "all", label: "All items" },
  ...CATEGORIES,
];

const TYPE_META = {
  image:   { label: "Image",   Icon: FiImage,   color: "text-graphite",          bg: "bg-cream" },
  youtube: { label: "YouTube", Icon: FiYoutube, color: "text-red-600",           bg: "bg-red-50" },
  video:   { label: "Video",   Icon: FiFilm,    color: "text-blue-600",          bg: "bg-blue-50" },
};

const ASPECTS = [
  { value: "wide", label: "Wide (4:3)" },
  { value: "tall", label: "Tall (3:4)" },
  { value: "square", label: "Square" },
];

const ACCEPT_MIME = "image/jpeg,image/png,image/webp,image/avif,image/gif";

// ─── Component ──────────────────────────────────────
export default function GalleryAdmin() {
  const toast = useToast();
  const confirm = useConfirm();
  const imgRef = useRef();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Image upload modal state
  const [imgOpen, setImgOpen] = useState(false);
  const [imgFiles, setImgFiles] = useState([]);
  const [imgMeta, setImgMeta] = useState({ category: "exterior", showOnHome: false });
  const [imgUploading, setImgUploading] = useState(false);
  const [imgProgress, setImgProgress] = useState({ done: 0, total: 0 });

  // YouTube modal state
  const [ytOpen, setYtOpen] = useState(false);
  const [yt, setYt] = useState({ title: "", category: "video", youtubeUrl: "", showOnHome: false });
  const [ytSaving, setYtSaving] = useState(false);

  // Detail drawer
  const [activeItem, setActiveItem] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // ─── Data ─────────────────────────────────────────
  const load = () => {
    setLoading(true);
    galleryApi
      .list()
      .then((d) => setItems(d.items))
      .catch(() => toast.error("Failed to load gallery"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []); // eslint-disable-line

  // ─── Filtering ────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (filter !== "all" && it.category !== filter) return false;
      if (q && !(it.title || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, filter, search]);

  // ─── Image upload modal ───────────────────────────
  const openImageModal = (files = []) => {
    setImgFiles(files);
    setImgMeta({ category: "exterior", showOnHome: false });
    setImgProgress({ done: 0, total: 0 });
    setImgOpen(true);
  };
  const closeImageModal = () => {
    if (imgUploading) return;
    setImgOpen(false);
    setImgFiles([]);
  };

  // Each file gets wrapped with an editable title so admins can override the
  // auto-derived filename before upload.
  const toFileEntry = (file) => ({
    file,
    title: file.name.replace(/\.[^.]+$/, ""),
  });

  const addToImageModalFiles = (filesLike) => {
    const incoming = Array.from(filesLike || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!incoming.length) {
      toast.error("Only image files are accepted.");
      return;
    }
    setImgFiles((prev) => [...prev, ...incoming.map(toFileEntry)]);
  };

  const onChooseFiles = (e) => {
    addToImageModalFiles(e.target.files);
    if (imgRef.current) imgRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const incoming = Array.from(e.dataTransfer.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!incoming.length) {
      toast.error("Only image files are accepted.");
      return;
    }
    openImageModal(incoming.map(toFileEntry));
  };

  const removeFile = (idx) => {
    setImgFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateFileTitle = (idx, value) => {
    setImgFiles((prev) =>
      prev.map((entry, i) => (i === idx ? { ...entry, title: value } : entry))
    );
  };

  const runUpload = async () => {
    if (!imgFiles.length) return;
    // Require titles — empty title = useless display name
    const missing = imgFiles.filter((e) => !e.title.trim());
    if (missing.length) {
      toast.error(
        missing.length === 1
          ? "Please add a title for the file."
          : `Please add a title for all ${missing.length} files.`
      );
      return;
    }
    setImgUploading(true);
    setImgProgress({ done: 0, total: imgFiles.length });
    let failed = 0;
    for (const entry of imgFiles) {
      try {
        await galleryApi.uploadImage(entry.file, {
          title: entry.title.trim(),
          category: imgMeta.category,
          aspect: "wide",
          showOnHome: imgMeta.showOnHome ? "true" : "false",
        });
      } catch (ex) {
        failed += 1;
        toast.error(ex.response?.data?.error || `Failed: ${entry.file.name}`);
      } finally {
        setImgProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }
    const success = imgFiles.length - failed;
    if (success > 0) {
      toast.success(
        success === 1 ? "Image uploaded" : `${success} images uploaded`
      );
    }
    setImgUploading(false);
    setImgOpen(false);
    setImgFiles([]);
    load();
  };

  // ─── YouTube ──────────────────────────────────────
  const openYouTube = () => {
    setYt({ title: "", category: "video", youtubeUrl: "", showOnHome: false });
    setYtOpen(true);
  };

  const onCreateYoutube = async (e) => {
    e.preventDefault();
    if (!yt.title.trim() || !yt.youtubeUrl.trim()) {
      return toast.error("Title and URL are required");
    }
    setYtSaving(true);
    try {
      await galleryApi.createYoutube(yt);
      toast.success("YouTube video added");
      setYtOpen(false);
      load();
    } catch (ex) {
      toast.error(ex.response?.data?.error || "Add failed");
    } finally {
      setYtSaving(false);
    }
  };

  // ─── Edit / Delete ────────────────────────────────
  const openEditor = (item) => {
    setActiveItem(item);
    setEditing({ ...item });
  };
  const closeEditor = () => {
    setActiveItem(null);
    setEditing(null);
  };
  const saveEditor = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const updated = await galleryApi.update(editing._id, {
        title: editing.title,
        category: editing.category,
        aspect: editing.aspect,
        showOnHome: !!editing.showOnHome,
        ...(editing.type === "youtube"
          ? { youtubeUrl: editing.youtubeUrl, thumbnail: editing.thumbnail }
          : {}),
      });
      setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
      setActiveItem(updated);
      setEditing(updated);
      toast.success("Saved");
    } catch (ex) {
      toast.error(ex.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    const ok = await confirm({
      title: `Delete "${item.title}"?`,
      message: item.type === "youtube"
        ? "The video will be removed from the gallery. The YouTube original is not affected."
        : "This will permanently remove the image from the gallery. This action cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await galleryApi.remove(item._id);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      if (activeItem?._id === item._id) closeEditor();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ─── Render ───────────────────────────────────────
  return (
    <>
      <input
        ref={imgRef}
        type="file"
        accept={ACCEPT_MIME}
        multiple
        onChange={onChooseFiles}
        className="hidden"
      />

      <PageHeader
        title="Gallery"
        subtitle={
          items.length === 0
            ? "Upload an image or embed a YouTube video to begin."
            : `${items.length} item${items.length === 1 ? "" : "s"}`
        }
        actions={
          <>
            <Button type="button" onClick={() => openImageModal([])}>
              <FiUpload className="w-3.5 h-3.5" />
              Upload Image
            </Button>
            <Button type="button" variant="ghost" onClick={openYouTube}>
              <FiYoutube className="w-3.5 h-3.5 text-red-600" />
              Add YouTube
            </Button>
          </>
        }
      />

      {/* Filter + Search */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl p-3 mb-5 flex flex-col sm:flex-row gap-3 shadow-[0_1px_3px_rgba(26,24,21,0.04)]">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ash pointer-events-none" />
            <input
              type="search"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-cream/60 border border-transparent hover:border-line focus:bg-white focus:border-graphite rounded-xl pl-10 pr-4 py-2.5 text-sm text-graphite outline-none placeholder:text-ash transition-all"
            />
          </div>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={FILTER_OPTIONS}
            className="sm:w-52"
          />
        </div>
      )}

      {/* Grid (or empty state) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative rounded-2xl transition-all ${
          dragOver ? "ring-2 ring-terracotta ring-offset-4 ring-offset-[#F5F5F7]" : ""
        }`}
      >
        {/* Drag-over overlay */}
        <AnimatePresence>
          {dragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 rounded-2xl bg-terracotta/[0.06] backdrop-blur-sm flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white rounded-2xl px-6 py-5 shadow-xl text-center">
                <FiUpload className="w-7 h-7 text-terracotta mx-auto mb-2" />
                <div className="text-sm font-semibold text-graphite">
                  Drop to upload
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="aspect-square bg-white rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={FiImage}
            title="Your gallery is empty"
            message="Click 'Upload Image' to add photos, or drag images anywhere on this page. Use 'Add YouTube' to embed a video."
            action={
              <Button onClick={() => openImageModal([])}>
                <FiUpload className="w-4 h-4" /> Upload your first image
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FiSearch}
            title="No matches"
            message={
              search
                ? `Nothing matches "${search}" — try a different keyword or filter.`
                : "No items in this category yet."
            }
            action={
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((item) => {
              const meta = TYPE_META[item.type] || TYPE_META.image;
              const TypeIcon = meta.Icon;
              const thumbSrc =
                item.type === "youtube"
                  ? item.thumbnail || getYouTubeThumb(item.youtubeUrl) || ""
                  : item.url;

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(26,24,21,0.04)] hover:shadow-[0_4px_20px_rgba(26,24,21,0.08)] transition-all duration-200"
                >
                  {/* Thumbnail (click to edit) */}
                  <button
                    type="button"
                    onClick={() => openEditor(item)}
                    className="block w-full text-left"
                    title="Edit"
                  >
                    <div className="relative aspect-square bg-cream overflow-hidden">
                      {thumbSrc ? (
                        item.type === "video" ? (
                          <video src={thumbSrc} muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img
                            src={thumbSrc}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out-expo"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ash">
                          <TypeIcon className="w-8 h-8" />
                        </div>
                      )}

                      {/* Single status row — overlays bottom of thumb */}
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end gap-2 pointer-events-none">
                        {item.showOnHome ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-terracotta text-white shadow-sm">
                            <FiHome className="w-2.5 h-2.5" /> Home
                          </span>
                        ) : <span />}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${meta.bg} ${meta.color}`}
                        >
                          <TypeIcon className="w-2.5 h-2.5" />
                          {meta.label}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Footer */}
                  <div className="p-3 flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-graphite truncate" title={item.title}>
                        {item.title}
                      </div>
                      <div className="text-[10px] text-ash uppercase tracking-widest mt-0.5">
                        {item.category}
                      </div>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditor(item)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-smoke hover:text-graphite hover:bg-cream"
                        title="Edit"
                        aria-label="Edit"
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-smoke hover:text-red-500 hover:bg-red-50"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Subtle drag-hint when grid not empty */}
      {items.length > 0 && (
        <p className="text-[11px] text-ash text-center mt-5">
          Tip · drag images anywhere on this page to upload.
        </p>
      )}

      {/* ── Image Upload Modal ──────────────────────── */}
      <AnimatePresence>
        {imgOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeImageModal}
              className="fixed inset-0 bg-graphite/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
                <header className="flex items-start justify-between p-7 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                      <FiUpload className="w-4 h-4 text-terracotta" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-graphite">
                        Upload images
                      </h3>
                      <p className="text-xs text-smoke mt-0.5">
                        Choose category and home-page setting, then upload.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeImageModal}
                    disabled={imgUploading}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-smoke hover:text-graphite hover:bg-cream disabled:opacity-40"
                    aria-label="Close"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto px-7 space-y-5">
                  {/* File chooser */}
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-smoke mb-1.5">
                      Images & titles
                    </span>
                    {imgFiles.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => imgRef.current?.click()}
                        disabled={imgUploading}
                        className="w-full rounded-xl border-2 border-dashed border-[rgba(26,24,21,0.14)] hover:border-terracotta/40 hover:bg-cream/40 py-7 text-center transition-all"
                      >
                        <FiImage className="w-7 h-7 text-ash mx-auto mb-2" />
                        <div className="text-sm font-medium text-graphite">Click to choose files</div>
                        <div className="text-xs text-smoke mt-1">or drag them here · multiple supported</div>
                      </button>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {imgFiles.map((entry, i) => (
                          <div
                            key={`${entry.file.name}-${i}`}
                            className="rounded-xl border border-line bg-white p-3 space-y-2.5"
                          >
                            {/* Top row: filename + size + remove */}
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-lg bg-cream flex items-center justify-center shrink-0">
                                <FiImage className="w-3.5 h-3.5 text-ash" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-[11px] text-smoke truncate" title={entry.file.name}>
                                  {entry.file.name}
                                </div>
                                <div className="text-[10px] text-ash tabular-nums">
                                  {(entry.file.size / 1024).toFixed(0)} KB
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                disabled={imgUploading}
                                className="w-7 h-7 rounded text-smoke hover:text-red-500 hover:bg-red-50 flex items-center justify-center disabled:opacity-40 shrink-0"
                                aria-label="Remove file"
                              >
                                <FiX className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Title input — labelled, full width, prominent */}
                            <label className="block">
                              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-smoke mb-1">
                                Title
                              </span>
                              <input
                                type="text"
                                value={entry.title}
                                onChange={(e) => updateFileTitle(i, e.target.value)}
                                disabled={imgUploading}
                                placeholder="e.g. Marine Drive Pool"
                                className="w-full bg-cream/50 border border-line hover:border-[rgba(26,24,21,0.2)] focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 focus:bg-white rounded-lg px-3 py-2 text-sm text-graphite outline-none placeholder:text-ash transition-all"
                              />
                            </label>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => imgRef.current?.click()}
                          disabled={imgUploading}
                          className="w-full text-xs text-terracotta hover:bg-cream py-2.5 border border-dashed border-line rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <FiPlus className="w-3 h-3" /> Add more files
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <Select
                    label="Category"
                    value={imgMeta.category}
                    onChange={(e) => setImgMeta({ ...imgMeta, category: e.target.value })}
                    options={CATEGORIES}
                  />

                  {/* Show on Home */}
                  <Toggle
                    checked={imgMeta.showOnHome}
                    onChange={(v) => setImgMeta({ ...imgMeta, showOnHome: v })}
                    label={
                      <span className="inline-flex items-center gap-1.5">
                        <FiHome className="w-3.5 h-3.5 text-terracotta" />
                        Show on Home page
                      </span>
                    }
                    hint="Files uploaded in this batch will appear in the home-page gallery preview."
                  />

                  {/* Progress bar while uploading */}
                  {imgUploading && imgProgress.total > 0 && (
                    <div>
                      <div className="flex justify-between text-[11px] text-smoke mb-1.5">
                        <span>Uploading…</span>
                        <span className="tabular-nums">{imgProgress.done} / {imgProgress.total}</span>
                      </div>
                      <div className="h-1.5 bg-cream rounded-full overflow-hidden">
                        <div
                          className="h-full bg-terracotta transition-all duration-300"
                          style={{ width: `${(imgProgress.done / imgProgress.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <footer className="p-7 pt-5 flex items-center gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={closeImageModal} disabled={imgUploading}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={runUpload}
                    loading={imgUploading}
                    disabled={imgFiles.length === 0}
                  >
                    <FiUpload className="w-3.5 h-3.5" />
                    {imgUploading
                      ? "Uploading…"
                      : `Upload ${imgFiles.length || ""} ${imgFiles.length === 1 ? "image" : "images"}`}
                  </Button>
                </footer>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── YouTube Modal ───────────────────────────── */}
      <AnimatePresence>
        {ytOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setYtOpen(false)}
              className="fixed inset-0 bg-graphite/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <form
                onSubmit={onCreateYoutube}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 space-y-5 pointer-events-auto"
              >
                <header className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <FiYoutube className="w-4 h-4 text-red-600" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-graphite">
                        Embed YouTube video
                      </h3>
                      <p className="text-xs text-smoke mt-0.5">
                        Paste any YouTube URL or video ID.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setYtOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-smoke hover:text-graphite hover:bg-cream"
                    aria-label="Close"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </header>

                <Input
                  label="Title"
                  value={yt.title}
                  onChange={(e) => setYt({ ...yt, title: e.target.value })}
                  placeholder="e.g. Brand Film 2026"
                  autoFocus
                />
                <Input
                  label="YouTube URL or ID"
                  value={yt.youtubeUrl}
                  onChange={(e) => setYt({ ...yt, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=…"
                />
                <Select
                  label="Category"
                  value={yt.category}
                  onChange={(e) => setYt({ ...yt, category: e.target.value })}
                  options={CATEGORIES}
                />

                <Toggle
                  checked={yt.showOnHome}
                  onChange={(v) => setYt({ ...yt, showOnHome: v })}
                  label={
                    <span className="inline-flex items-center gap-1.5">
                      <FiHome className="w-3.5 h-3.5 text-terracotta" />
                      Show on Home page
                    </span>
                  }
                  hint="Appears in the home-page gallery preview."
                />

                <div className="flex items-center gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setYtOpen(false)} className="ml-auto">
                    Cancel
                  </Button>
                  <Button type="submit" loading={ytSaving}>
                    <FiPlus className="w-3.5 h-3.5" /> Add video
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Edit drawer ─────────────────────────────── */}
      <AnimatePresence>
        {activeItem && editing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditor}
              className="fixed inset-0 bg-graphite/30 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <header className="flex items-center justify-between px-6 py-4 border-b border-line">
                <h3 className="text-base font-semibold tracking-tight text-graphite">
                  Edit item
                </h3>
                <button
                  onClick={closeEditor}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-smoke hover:text-graphite hover:bg-cream transition-colors"
                  aria-label="Close"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-cream">
                  {activeItem.type === "youtube" ? (
                    activeItem.youtubeUrl ? (
                      <iframe
                        src={activeItem.youtubeUrl}
                        title={activeItem.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ash">
                        <FiYoutube className="w-10 h-10" />
                      </div>
                    )
                  ) : activeItem.type === "video" ? (
                    <video src={activeItem.url} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={activeItem.url} alt={activeItem.title} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Quick info row */}
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cream text-smoke uppercase tracking-widest font-medium">
                    {TYPE_META[activeItem.type]?.label || activeItem.type}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cream text-smoke uppercase tracking-widest font-medium">
                    {new Date(activeItem.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {activeItem.url && (
                    <a
                      href={activeItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-terracotta/10 text-terracotta uppercase tracking-widest font-medium hover:bg-terracotta hover:text-white transition-colors"
                    >
                      Open <FiExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Fields */}
                <Input
                  label="Title"
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="A short, descriptive title"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Category"
                    value={editing.category || "other"}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    options={CATEGORIES}
                  />
                  <Select
                    label="Aspect"
                    value={editing.aspect || "wide"}
                    onChange={(e) => setEditing({ ...editing, aspect: e.target.value })}
                    options={ASPECTS}
                  />
                </div>

                <div className="pt-2 border-t border-line">
                  <Toggle
                    checked={!!editing.showOnHome}
                    onChange={(v) => setEditing({ ...editing, showOnHome: v })}
                    label={
                      <span className="inline-flex items-center gap-1.5">
                        <FiHome className="w-3.5 h-3.5 text-terracotta" />
                        Show on Home page
                      </span>
                    }
                    hint="When on, this item appears in the home-page gallery preview."
                  />
                </div>

                {activeItem.type === "youtube" && (
                  <>
                    <Input
                      label="YouTube URL"
                      value={editing.youtubeUrl || ""}
                      onChange={(e) => setEditing({ ...editing, youtubeUrl: e.target.value })}
                    />
                    <Input
                      label="Custom thumbnail URL"
                      value={editing.thumbnail || ""}
                      onChange={(e) => setEditing({ ...editing, thumbnail: e.target.value })}
                      hint="Optional. Leave blank to use YouTube's automatic thumbnail."
                    />
                  </>
                )}
              </div>

              <footer className="border-t border-line px-6 py-4 flex items-center gap-2">
                <Button
                  variant="danger"
                  onClick={() => onDelete(activeItem)}
                  className="mr-auto"
                >
                  <FiTrash2 className="w-3.5 h-3.5" /> Delete
                </Button>
                <Button variant="ghost" onClick={closeEditor}>
                  Cancel
                </Button>
                <Button onClick={saveEditor} loading={saving}>
                  <FiCheck className="w-4 h-4" />
                  Save
                </Button>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
