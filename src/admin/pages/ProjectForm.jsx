import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiTrash2 } from "react-icons/fi";
import { projectsApi } from "../api/endpoints";
import { useToast } from "../components/Toast";
import {
  Card, PageHeader, Button, Input, Select, Textarea, FormField, Toggle, StickyActionBar,
} from "../components/ui";
import RichTextEditor from "../components/RichTextEditor";
import Repeater from "../components/Repeater";
import UnitsManager from "../components/UnitsManager";
import { AMENITY_ICONS, SPEC_ICONS } from "../../utils/iconCatalogs";

const STATUS_OPTIONS = [
  { value: "ongoing", label: "Ongoing" },
  { value: "ready", label: "Ready to Move In" },
  { value: "completed", label: "Completed" },
  { value: "upcoming", label: "New Launch" },
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
  propertyTypeOther: "",
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
  inventory: [],
  connectivity: [],
  mapEmbed: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  isPublished: true,
  featured: false,
  inBanner: false,
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
        // Media (featuredImage / galleryImages) live in `project`, NOT in `data`.
        // Mixing them into form state causes stale values to overwrite uploads on save.
        // eslint-disable-next-line no-unused-vars
        const { featuredImage, galleryImages, _id, slug, createdAt, updatedAt, createdBy, ...formFields } = p;

        // ─── Legacy-data migration ──────────────────────────────────
        // Older records may have the inventory array stored under `units`
        // (before the rename). Coerce: array → move to `inventory`, force
        // `units` back to a string so the Mongoose schema doesn't choke
        // on save.
        const legacyArray = Array.isArray(formFields.units) ? formFields.units : null;
        const safeUnits =
          typeof formFields.units === "string" ? formFields.units : "";
        const safeInventory = Array.isArray(formFields.inventory)
          ? formFields.inventory
          : legacyArray || [];

        setData({
          ...blankProject,
          ...formFields,
          units: safeUnits,
          inventory: safeInventory,
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
      // Defensive: never send media via JSON update — that's done via dedicated
      // upload endpoints. Also drop empty repeater rows so Mongoose doesn't
      // 400 on missing required `title`.
      // eslint-disable-next-line no-unused-vars
      const { featuredImage, galleryImages, ...formOnly } = data;
      const payload = {
        ...formOnly,
        keywords: data.keywords,
        // Schema field `units` is a STRING ("184 Apartments"). If state somehow
        // holds an array from legacy data, coerce to empty so Mongoose doesn't
        // throw a Cast error.
        units: typeof data.units === "string" ? data.units : "",
        amenities: (data.amenities || []).filter((a) => a && a.title && a.title.trim()),
        specifications: (data.specifications || []).filter((s) => s && s.title && s.title.trim()),
        inventory: (Array.isArray(data.inventory) ? data.inventory : []).filter(
          (u) => u && u.unitNumber && u.unitNumber.trim()
        ),
        connectivity: (data.connectivity || []).filter((c) => c && c.label && c.label.trim()),
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-white rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-56 bg-white rounded-2xl" />
            <div className="h-72 bg-white rounded-2xl" />
            <div className="h-44 bg-white rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-44 bg-white rounded-2xl" />
            <div className="h-44 bg-white rounded-2xl" />
            <div className="h-32 bg-white rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-base font-semibold tracking-tight text-graphite">Basics</h2>
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

            {/* Free-text input appears only when "Other" is selected */}
            {data.propertyType === "Other" && (
              <Input
                label="Specify property type *"
                value={data.propertyTypeOther}
                onChange={(e) => set("propertyTypeOther", e.target.value)}
                placeholder="e.g. Row House, Farmhouse, Plot + Construction"
                hint="Shown on the public site in place of 'Other'."
              />
            )}
          </Card>

          {/* Specs */}
          <Card className="p-6 space-y-5">
            <h2 className="text-base font-semibold tracking-tight text-graphite">Specifications</h2>
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
            <h2 className="text-base font-semibold tracking-tight text-graphite mb-4">Description</h2>
            <RichTextEditor
              value={data.description}
              onChange={(v) => set("description", v)}
              placeholder="Tell the story of this project…"
            />
          </Card>

          {/* Repeaters */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-graphite">Amenities</h2>
              <p className="text-xs text-smoke mt-1">
                Pick an icon — the title fills in automatically. Edit the title
                if you want a custom name (e.g. <em>20m Heated Pool</em>).
              </p>
            </div>
            <Repeater
              value={data.amenities}
              onChange={(v) => set("amenities", v)}
              fields={[
                {
                  name: "icon",
                  label: "Icon",
                  type: "icon",
                  catalog: AMENITY_ICONS,
                  linkedField: "title",
                  placeholder: "Choose icon",
                },
                { name: "title", label: "Title", placeholder: "Custom name (optional)" },
              ]}
              addLabel="Add Amenity"
              emptyMessage="No amenities yet — click Add Amenity."
            />
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-graphite">Specifications</h2>
              <p className="text-xs text-smoke mt-1">
                Pick an icon — the title fills in automatically. Add a short
                description for the spec sheet.
              </p>
            </div>
            <Repeater
              value={data.specifications}
              onChange={(v) => set("specifications", v)}
              fields={[
                {
                  name: "icon",
                  label: "Icon",
                  type: "icon",
                  catalog: SPEC_ICONS,
                  linkedField: "title",
                  placeholder: "Choose icon",
                },
                { name: "title", label: "Title", placeholder: "Custom name (optional)" },
                {
                  name: "description",
                  label: "Description",
                  placeholder: "e.g. Imported Italian marble in living areas; engineered oak in bedrooms.",
                  type: "textarea",
                },
              ]}
              addLabel="Add Specification"
              emptyMessage="No specifications yet — click Add Specification."
            />
          </Card>

          {/* Connectivity / Nearby */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-graphite">Connectivity & Nearby</h2>
              <p className="text-xs text-smoke mt-1">
                Cards displayed under the map on the project page. Each row shows a landmark with distance and travel time.
              </p>
            </div>
            <Repeater
              value={data.connectivity}
              onChange={(v) => set("connectivity", v)}
              fields={[
                { name: "label", label: "Place", placeholder: "e.g. Airport" },
                { name: "value", label: "Distance", placeholder: "e.g. 12 km" },
                { name: "time", label: "Travel time", placeholder: "e.g. ~22 min" },
              ]}
              addLabel="Add Landmark"
              emptyMessage="No nearby landmarks yet — click Add Landmark."
            />
          </Card>

          {/* Inventory / Unit availability */}
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-graphite">Inventory & Availability</h2>
              <p className="text-xs text-smoke mt-1">
                Add each apartment / villa with its status. Visitors will see a
                live availability chart on the project page. <strong>Unit number is required</strong> — other fields are optional.
              </p>
            </div>
            <UnitsManager
              value={data.inventory || []}
              onChange={(v) => set("inventory", v)}
            />
          </Card>

          {/* SEO */}
          <Card className="p-6 space-y-5">
            <h2 className="text-base font-semibold tracking-tight text-graphite">SEO</h2>
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
          <Card className="p-6 space-y-5">
            <h2 className="text-sm font-semibold tracking-tight text-graphite">Visibility</h2>
            <Toggle
              checked={data.isPublished}
              onChange={(v) => set("isPublished", v)}
              label="Published"
              hint="When off, this project is hidden from the public site."
            />
            <Toggle
              checked={data.featured}
              onChange={(v) => set("featured", v)}
              label="Pin to Featured Projects grid"
              hint="Promotes this project in the home-page Featured Projects section."
            />
            <Toggle
              checked={data.inBanner}
              onChange={(v) => set("inBanner", v)}
              label="Add to home-page banner"
              hint="Includes this project in the rotating hero banner. Recommend keeping 2–5 slides max."
            />
          </Card>

          {/* Featured image */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold tracking-tight text-graphite mb-3">Featured Image</h2>
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
            <h2 className="text-sm font-semibold tracking-tight text-graphite mb-3">Gallery Images</h2>
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
            <h2 className="text-sm font-semibold tracking-tight text-graphite">Media & Map</h2>
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

      <StickyActionBar>
        <span className="text-xs text-smoke mr-auto hidden sm:inline">
          {isEdit ? "Editing existing project" : "Creating new project — slug auto-generates from name"}
        </span>
        <Link to="/admin/projects">
          <Button type="button" variant="ghost">Cancel</Button>
        </Link>
        <Button type="submit" loading={saving}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
        </Button>
      </StickyActionBar>
    </form>
  );
}
