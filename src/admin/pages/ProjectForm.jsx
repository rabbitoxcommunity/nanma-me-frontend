import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiTrash2 } from "react-icons/fi";
import { projectsApi } from "../api/endpoints";
import { useToast } from "../components/Toast";
import {
  Card, PageHeader, Button, Input, Select, Textarea, FormField,
} from "../components/ui";
import RichTextEditor from "../components/RichTextEditor";
import Repeater from "../components/Repeater";

const STATUS_OPTIONS = [
  { value: "ongoing", label: "Ongoing" },
  { value: "ready", label: "Ready to Move In" },
  { value: "completed", label: "Completed" },
  { value: "upcoming", label: "Upcoming" },
];

const PROPERTY_TYPES = [
  "Apartment", "Villa", "Flat", "Plot", "Penthouse", "Duplex", "Studio", "Other",
];

const blankProject = {
  reraNumber: "",
  name: "",
  tagline: "",
  location: "",
  status: "ongoing",
  propertyType: "Apartment",
  sqft: "",
  bhk: "",
  developmentSize: "",
  floor: "",
  units: "",
  priceFrom: "",
  handover: "",
  description: "",
  videoUrl: "",
  amenities: [],
  specifications: [],
  mapEmbed: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  isPublished: true,
  featured: false,
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = id && id !== "new";
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState(blankProject);
  const [project, setProject] = useState(null); // server record (for slug, media, etc)
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const featuredRef = useRef();
  const galleryRef = useRef();

  // Load existing
  useEffect(() => {
    if (!isEdit) return;
    projectsApi
      .get(id)
      .then((p) => {
        setProject(p);
        setData({
          ...blankProject,
          ...p,
          keywords: Array.isArray(p.keywords) ? p.keywords.join(", ") : p.keywords || "",
        });
      })
      .catch(() => toast.error("Failed to load project"))
      .finally(() => setLoading(false));
  }, [id, isEdit]); // eslint-disable-line

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const onSave = async (e) => {
    e?.preventDefault();
    if (!data.name.trim() || !data.location.trim()) {
      return toast.error("Name and Location are required");
    }
    setSaving(true);
    try {
      const payload = {
        ...data,
        keywords: data.keywords,
      };
      if (isEdit) {
        const updated = await projectsApi.update(id, payload);
        setProject(updated);
        toast.success("Project updated");
      } else {
        const created = await projectsApi.create(payload);
        toast.success("Project created");
        navigate(`/admin/projects/${created._id}`, { replace: true });
      }
    } catch (ex) {
      toast.error(ex.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onUploadFeatured = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isEdit) return toast.error("Save the project first to upload media.");
    setUploadingFeatured(true);
    try {
      const featured = await projectsApi.uploadFeatured(id, file);
      setProject((p) => ({ ...p, featuredImage: featured }));
      toast.success("Featured image updated");
    } catch (ex) {
      toast.error(ex.response?.data?.error || "Upload failed");
    } finally {
      setUploadingFeatured(false);
      featuredRef.current && (featuredRef.current.value = "");
    }
  };

  const onUploadGallery = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    if (!isEdit) return toast.error("Save the project first to upload media.");
    setUploadingGallery(true);
    try {
      const list = await projectsApi.uploadGallery(id, files);
      setProject((p) => ({ ...p, galleryImages: list }));
      toast.success(`Uploaded ${files.length} image(s)`);
    } catch (ex) {
      toast.error(ex.response?.data?.error || "Upload failed");
    } finally {
      setUploadingGallery(false);
      galleryRef.current && (galleryRef.current.value = "");
    }
  };

  const onRemoveGallery = async (publicId) => {
    try {
      const list = await projectsApi.removeGallery(id, publicId);
      setProject((p) => ({ ...p, galleryImages: list }));
    } catch {
      toast.error("Could not remove image");
    }
  };

  if (loading) return <div className="text-smoke">Loading project…</div>;

  return (
    <form onSubmit={onSave}>
      <PageHeader
        title={isEdit ? "Edit Project" : "New Project"}
        subtitle={isEdit ? `/${project?.slug}` : "Fill in details. Slug auto-generates from name."}
        actions={
          <>
            <Link to="/admin/projects">
              <Button variant="ghost" type="button">
                <FiArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basics */}
          <Card className="p-6 space-y-5">
            <h2 className="font-display text-xl text-graphite">Basics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="RERA Number"
                value={data.reraNumber}
                onChange={(e) => set("reraNumber", e.target.value)}
                placeholder="P51800012345"
              />
              <Input
                label="Project Name *"
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Azure Skyline Residences"
                required
              />
            </div>
            <Input
              label="Tagline"
              value={data.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="Where the city becomes your skyline."
              hint="One short editorial line shown under the project hero."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Location *"
                value={data.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Marine Drive, Mumbai"
                required
              />
              <Select
                label="Project Type *"
                value={data.status}
                onChange={(e) => set("status", e.target.value)}
                options={STATUS_OPTIONS}
              />
              <Select
                label="Property Type"
                value={data.propertyType}
                onChange={(e) => set("propertyType", e.target.value)}
                options={PROPERTY_TYPES}
              />
            </div>
          </Card>

          {/* Specs */}
          <Card className="p-6 space-y-5">
            <h2 className="font-display text-xl text-graphite">Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                label="Sq. Ft."
                value={data.sqft}
                onChange={(e) => set("sqft", e.target.value)}
                placeholder="1,840 – 4,200"
              />
              <Input
                label="BHK"
                value={data.bhk}
                onChange={(e) => set("bhk", e.target.value)}
                placeholder="3 & 4 BHK"
              />
              <Input
                label="Development Size"
                value={data.developmentSize}
                onChange={(e) => set("developmentSize", e.target.value)}
                placeholder="3.2 Acres"
              />
              <Input
                label="Floor"
                value={data.floor}
                onChange={(e) => set("floor", e.target.value)}
                placeholder="G+42"
              />
              <Input
                label="Total Units"
                value={data.units}
                onChange={(e) => set("units", e.target.value)}
                placeholder="184"
              />
              <Input
                label="Price From"
                value={data.priceFrom}
                onChange={(e) => set("priceFrom", e.target.value)}
                placeholder="₹ 8.5 Cr onwards"
              />
              <Input
                label="Handover"
                value={data.handover}
                onChange={(e) => set("handover", e.target.value)}
                placeholder="Q4 2026"
              />
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="font-display text-xl text-graphite mb-4">Description</h2>
            <RichTextEditor
              value={data.description}
              onChange={(v) => set("description", v)}
              placeholder="Tell the story of this project…"
            />
          </Card>

          {/* Repeaters */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="font-display text-xl text-graphite">Amenities</h2>
              <p className="text-xs text-smoke mt-1">Use icon keys (pool, gym, spa…) or any short label.</p>
            </div>
            <Repeater
              value={data.amenities}
              onChange={(v) => set("amenities", v)}
              fields={[
                { name: "icon", label: "Icon", placeholder: "pool, gym, spa…" },
                { name: "title", label: "Title", placeholder: "Infinity Pool" },
              ]}
              addLabel="Add Amenity"
              emptyMessage="No amenities yet — click Add Amenity."
            />
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h2 className="font-display text-xl text-graphite">Specifications</h2>
              <p className="text-xs text-smoke mt-1">Icon + title + a short description.</p>
            </div>
            <Repeater
              value={data.specifications}
              onChange={(v) => set("specifications", v)}
              fields={[
                { name: "icon", label: "Icon", placeholder: "structure" },
                { name: "title", label: "Title", placeholder: "Structure" },
                { name: "description", label: "Description", placeholder: "RCC framed earthquake-resistant…", type: "textarea" },
              ]}
              addLabel="Add Specification"
              emptyMessage="No specifications yet — click Add Specification."
            />
          </Card>

          {/* SEO */}
          <Card className="p-6 space-y-5">
            <h2 className="font-display text-xl text-graphite">SEO</h2>
            <Input
              label="Meta Title"
              value={data.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
              placeholder="Defaults to project name"
            />
            <Textarea
              label="Meta Description"
              value={data.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              placeholder="A 1-2 line summary for search results."
              rows={3}
            />
            <Input
              label="Keywords"
              value={data.keywords}
              onChange={(e) => set("keywords", e.target.value)}
              placeholder="luxury apartments mumbai, sea view, marine drive"
              hint="Comma-separated."
            />
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Visibility */}
          <Card className="p-6 space-y-3">
            <h2 className="font-display text-lg text-graphite">Visibility</h2>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={data.isPublished}
                onChange={(e) => set("isPublished", e.target.checked)}
                className="w-4 h-4 accent-graphite"
              />
              Published (visible on site)
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={data.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 accent-graphite"
              />
              Featured on Home page
            </label>
          </Card>

          {/* Featured image */}
          <Card className="p-6">
            <h2 className="font-display text-lg text-graphite mb-3">Featured Image</h2>
            {project?.featuredImage?.url ? (
              <div className="relative aspect-video rounded overflow-hidden bg-cream mb-3">
                <img src={project.featuredImage.url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video rounded bg-cream mb-3 flex items-center justify-center text-xs text-smoke">
                No image set
              </div>
            )}
            <input
              ref={featuredRef}
              type="file"
              accept="image/*"
              onChange={onUploadFeatured}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => featuredRef.current?.click()}
              disabled={uploadingFeatured || !isEdit}
              className="w-full"
            >
              <FiUpload className="w-4 h-4" />
              {uploadingFeatured ? "Uploading…" : "Upload Featured"}
            </Button>
            {!isEdit && (
              <p className="text-xs text-smoke mt-2">Save the project first to upload media.</p>
            )}
          </Card>

          {/* Gallery */}
          <Card className="p-6">
            <h2 className="font-display text-lg text-graphite mb-3">Gallery Images</h2>
            {project?.galleryImages?.length ? (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {project.galleryImages.map((g) => (
                  <div key={g.publicId || g.url} className="relative group aspect-square rounded overflow-hidden bg-cream">
                    <img src={g.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemoveGallery(g.publicId)}
                      className="absolute top-1 right-1 w-7 h-7 rounded-full bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      aria-label="Remove"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-video rounded bg-cream mb-3 flex items-center justify-center text-xs text-smoke">
                No gallery images yet
              </div>
            )}
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onUploadGallery}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => galleryRef.current?.click()}
              disabled={uploadingGallery || !isEdit}
              className="w-full"
            >
              <FiUpload className="w-4 h-4" />
              {uploadingGallery ? "Uploading…" : "Upload Images"}
            </Button>
          </Card>

          {/* Video & Map */}
          <Card className="p-6 space-y-4">
            <h2 className="font-display text-lg text-graphite">Media & Map</h2>
            <Input
              label="Apartment Video URL (YouTube)"
              value={data.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
            />
            <FormField label="Google Map Embed (iframe src)" hint="Paste only the URL from the iframe.">
              <textarea
                rows={3}
                value={data.mapEmbed}
                onChange={(e) => set("mapEmbed", e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=…"
                className="w-full bg-white border border-line rounded px-3.5 py-2.5 text-sm text-graphite outline-none focus:border-graphite resize-y"
              />
            </FormField>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Link to="/admin/projects">
          <Button type="button" variant="ghost">Cancel</Button>
        </Link>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
