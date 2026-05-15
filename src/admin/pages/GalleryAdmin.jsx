import { useEffect, useRef, useState } from "react";
import { FiImage, FiFilm, FiYoutube, FiTrash2, FiUpload } from "react-icons/fi";
import { galleryApi } from "../api/endpoints";
import { Card, PageHeader, Button, Input, Select, EmptyState } from "../components/ui";
import { useToast } from "../components/Toast";

const CATEGORIES = [
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
  { value: "amenities", label: "Amenities" },
  { value: "video", label: "Video / Film" },
  { value: "other", label: "Other" },
];

const ASPECTS = [
  { value: "wide", label: "Wide (4:3)" },
  { value: "tall", label: "Tall (3:4)" },
  { value: "square", label: "Square" },
];

export default function GalleryAdmin() {
  const toast = useToast();
  const imgRef = useRef();
  const vidRef = useRef();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ title: "", category: "exterior", aspect: "wide" });
  const [yt, setYt] = useState({ title: "", category: "video", youtubeUrl: "", thumbnail: "" });
  const [uploading, setUploading] = useState(null); // 'image' | 'video' | null

  const load = () => {
    setLoading(true);
    galleryApi
      .list()
      .then((d) => setItems(d.items))
      .catch(() => toast.error("Failed to load gallery"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []); // eslint-disable-line

  const onUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("image");
    try {
      await galleryApi.uploadImage(file, meta);
      toast.success("Image uploaded");
      load();
    } catch (ex) {
      toast.error(ex.response?.data?.error || "Upload failed");
    } finally {
      setUploading(null);
      imgRef.current && (imgRef.current.value = "");
    }
  };

  const onUploadVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("video");
    try {
      await galleryApi.uploadVideo(file, { ...meta, category: meta.category || "video" });
      toast.success("Video uploaded");
      load();
    } catch (ex) {
      toast.error(ex.response?.data?.error || "Upload failed");
    } finally {
      setUploading(null);
      vidRef.current && (vidRef.current.value = "");
    }
  };

  const onCreateYoutube = async (e) => {
    e.preventDefault();
    if (!yt.title || !yt.youtubeUrl) return toast.error("Title and URL required");
    try {
      await galleryApi.createYoutube(yt);
      toast.success("YouTube embed added");
      setYt({ title: "", category: "video", youtubeUrl: "", thumbnail: "" });
      load();
    } catch (ex) {
      toast.error(ex.response?.data?.error || "Add failed");
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await galleryApi.remove(item._id);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Upload images, videos, and embed YouTube films."
      />

      {/* Shared meta */}
      <Card className="p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Title"
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
            placeholder="Optional title for next upload"
          />
          <Select
            label="Category"
            value={meta.category}
            onChange={(e) => setMeta({ ...meta, category: e.target.value })}
            options={CATEGORIES}
          />
          <Select
            label="Aspect"
            value={meta.aspect}
            onChange={(e) => setMeta({ ...meta, aspect: e.target.value })}
            options={ASPECTS}
          />
        </div>
      </Card>

      {/* Upload buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 text-center">
          <FiImage className="w-7 h-7 text-terracotta mx-auto mb-3" />
          <h3 className="text-sm font-semibold tracking-tight text-graphite mb-3">Image Upload</h3>
          <input ref={imgRef} type="file" accept="image/*" onChange={onUploadImage} className="hidden" />
          <Button
            type="button"
            variant="ghost"
            onClick={() => imgRef.current?.click()}
            disabled={uploading === "image"}
            className="w-full"
          >
            <FiUpload className="w-4 h-4" />
            {uploading === "image" ? "Uploading…" : "Choose Image"}
          </Button>
        </Card>

        <Card className="p-5 text-center">
          <FiFilm className="w-7 h-7 text-terracotta mx-auto mb-3" />
          <h3 className="text-sm font-semibold tracking-tight text-graphite mb-3">Video Upload</h3>
          <input ref={vidRef} type="file" accept="video/*" onChange={onUploadVideo} className="hidden" />
          <Button
            type="button"
            variant="ghost"
            onClick={() => vidRef.current?.click()}
            disabled={uploading === "video"}
            className="w-full"
          >
            <FiUpload className="w-4 h-4" />
            {uploading === "video" ? "Uploading…" : "Choose Video"}
          </Button>
        </Card>

        <Card className="p-5">
          <FiYoutube className="w-7 h-7 text-terracotta mx-auto mb-3 block" />
          <h3 className="text-sm font-semibold tracking-tight text-graphite mb-3 text-center">YouTube Embed</h3>
          <form onSubmit={onCreateYoutube} className="space-y-3">
            <input
              value={yt.title}
              onChange={(e) => setYt({ ...yt, title: e.target.value })}
              placeholder="Title"
              className="w-full bg-white border border-line rounded px-3 py-2 text-sm outline-none focus:border-graphite"
            />
            <input
              value={yt.youtubeUrl}
              onChange={(e) => setYt({ ...yt, youtubeUrl: e.target.value })}
              placeholder="YouTube URL or video ID"
              className="w-full bg-white border border-line rounded px-3 py-2 text-sm outline-none focus:border-graphite"
            />
            <Button type="submit" className="w-full">Add YouTube Video</Button>
          </form>
        </Card>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-smoke text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState title="Gallery is empty" message="Upload your first item above." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden group">
              <div className="relative aspect-square bg-cream">
                {item.type === "youtube" ? (
                  item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-graphite/90">
                      <FiYoutube className="w-12 h-12 text-bone/60" />
                    </div>
                  )
                ) : item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                )}
                <button
                  onClick={() => onDelete(item)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow"
                  aria-label="Delete"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-2 left-2 bg-bone/90 text-graphite text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                  {item.type}
                </span>
              </div>
              <div className="p-3">
                <div className="text-sm font-medium text-graphite truncate">{item.title}</div>
                <div className="text-[11px] text-smoke uppercase tracking-widest mt-1">{item.category}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
