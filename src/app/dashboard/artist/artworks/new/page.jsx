"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  ImageIcon,
  Tag,
  DollarSign,
  AlignLeft,
  Sparkles,
  Eye,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

/* =========================================================
   CONSTANTS
========================================================= */

const CATEGORIES = [
  { id: "painting",    label: "Painting",     emoji: "🎨" },
  { id: "sculpture",   label: "Sculpture",    emoji: "🗿" },
  { id: "photography", label: "Photography",  emoji: "📷" },
  { id: "digital",     label: "Digital Art",  emoji: "💻" },
  { id: "mixed-media", label: "Mixed Media",  emoji: "🖼" },
  { id: "drawing",     label: "Drawing",      emoji: "✏️" },
  { id: "print",       label: "Print",        emoji: "🖨" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Available for Sale", dot: "#22c55e" },
  { value: "draft",     label: "Save as Draft",      dot: "#f59e0b" },
  { value: "sold",      label: "Mark as Sold",       dot: "#ef4444" },
];

const MAX_SIZE_MB = 10;
const MAX_CHARS   = 1000;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* =========================================================
   PAGE
========================================================= */

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddArtworkPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [title,       setTitle]       = useState("");
  const [category,    setCategory]    = useState("painting");
  const [status,      setStatus]      = useState("available");
  const [price,       setPrice]       = useState("");
  const [description, setDescription] = useState("");
  const [medium,      setMedium]      = useState("");
  const [year,        setYear]        = useState(new Date().getFullYear().toString());

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview,      setPreview]      = useState(null);
  const [fileName,     setFileName]     = useState(null);
  const [uploadedUrl,  setUploadedUrl]  = useState(null);
  const [isDragging,   setIsDragging]   = useState(false);
  const [isUploading,  setIsUploading]  = useState(false);
  const [uploadError,  setUploadError]  = useState(null);
  const [touched,      setTouched]      = useState({});

  const inputRef = useRef(null);

  const markTouched = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const resetImage = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    setSelectedFile(null);
    setUploadedUrl(null);
    setUploadError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [preview]);

  const handleFile = useCallback((file) => {
    setUploadError(null);
    setUploadedUrl(null);
    if (!file) { resetImage(); return; }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only JPG, PNG and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`Image must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    setSelectedFile(file);
  }, [preview, resetImage]);

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };
  const handleChange = (e) => handleFile(e.target.files?.[0] ?? null);

  const uploadToImgBB = async () => {
    if (!selectedFile) { setUploadError("Please select an image first."); return null; }
    const formData = new FormData();
    formData.append("image", selectedFile);
    const res  = await fetch("/api/upload-imgbb", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.error || "Image upload failed.");
    setUploadedUrl(data.url);
    return data.url;
  };

  const errors = {
    title: touched.title && !title.trim()                 ? "Artwork title is required." : null,
    price: touched.price && (!price || Number(price) <= 0) ? "Enter a valid price greater than $0." : null,
    image: touched.image && !selectedFile && !uploadedUrl  ? "Please upload an artwork image." : null,
  };

  const isValid =
    title.trim() && price && Number(price) > 0 && (selectedFile || uploadedUrl);

  const handlePublish = async (e) => {
    if (e) e.preventDefault();
    if (isUploading) return;
    setTouched({ title: true, price: true, image: true });
    if (!title.trim()) { toast.error("Please enter an artwork title."); return; }
    if (!price || Number(price) <= 0) { toast.error("Please enter a valid price."); return; }
    if (!selectedFile && !uploadedUrl) { toast.error("Please upload an artwork image."); return; }
    setUploadError(null);
    setIsUploading(true);
    try {
      let finalImageUrl = uploadedUrl;
      if (!finalImageUrl) finalImageUrl = await uploadToImgBB();
      const categoryLabel = CATEGORIES.find(c => c.id === category)?.label || category;
      const artworkData = {
        title:       title.trim(),
        category:    categoryLabel,
        price:       Number(price),
        status,
        description: description.trim(),
        imageUrl:    finalImageUrl,
        medium:      medium.trim() || categoryLabel,
        year:        year || new Date().getFullYear().toString(),
        artistId:    user?.id || "",
        artistName:  user?.name || "Featured Artist",
        artistEmail: user?.email || "",
        featured:    false,
      };
      const r = await fetch(`${API}/artworks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artworkData),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error || "Failed to save artwork.");
      toast.success("Artwork published successfully!");
      setTimeout(() => {
        router.push("/dashboard/artist");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error("Publishing error:", error);
      const msg = error?.message || "Failed to publish artwork.";
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const currentCategory = CATEGORIES.find((c) => c.id === category);
  const currentStatus   = STATUS_OPTIONS.find((s) => s.value === status);
  const charCount       = description.length;
  const netPayout       = price && Number(price) > 0
    ? (Number(price) * 0.85).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  return (
    <div className="min-h-screen bg-[#f5f4f1]">

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#e5e1da] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard/artist"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e1da] bg-white text-[#55514c] transition-all duration-200 hover:border-[#e4574f]/40 hover:bg-[#fff5f5] hover:text-[#e4574f]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="font-art-display text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl">
                  Add New Artwork
                </h1>
                <span className="hidden rounded-full bg-[#e4574f]/10 px-2.5 py-0.5 font-art-body text-[9px] font-semibold uppercase tracking-widest text-[#e4574f] sm:inline-block">
                  New Listing
                </span>
              </div>
              <p className="mt-0.5 truncate font-art-body text-xs text-[#77736d]">
                Fill in the details below — your artwork will be live after publishing.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/dashboard/artist">
              <button
                type="button"
                className="hidden h-9 items-center gap-1.5 rounded-full border border-[#e5e1da] bg-white px-4 font-art-body text-xs font-medium text-[#55514c] transition-all duration-200 hover:border-[#55514c]/40 hover:text-[#171717] sm:flex"
              >
                Cancel
              </button>
            </Link>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isUploading}
              className="flex h-9 items-center gap-2 rounded-full bg-[#e4574f] px-5 font-art-body text-xs font-semibold text-white shadow-[0_4px_14px_rgba(228,87,79,0.3)] transition-all duration-200 hover:bg-[#ff7168] hover:shadow-[0_6px_20px_rgba(228,87,79,0.35)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Publishing…</span></>
              ) : (
                <><Sparkles className="h-3.5 w-3.5" /><span>Publish Artwork</span></>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form
          id="add-artwork-form"
          onSubmit={handlePublish}
          className="grid gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]"
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">

            {/* Section: Image Upload */}
            <FormSection icon={<ImageIcon size={15} />} label="Artwork Image" required>
              {!preview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={[
                    "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-all duration-200",
                    isDragging ? "border-[#e4574f] bg-[#fff5f5] scale-[1.005]" : "border-[#d9d5ce] bg-white hover:border-[#e4574f]/50 hover:bg-[#fffaf9]",
                    errors.image ? "border-red-400 bg-red-50/40" : "",
                  ].join(" ")}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200 ${isDragging ? "bg-[#e4574f]/15" : "bg-[#f5f4f1]"}`}>
                    <UploadCloud className={`h-7 w-7 transition-colors duration-200 ${isDragging ? "text-[#e4574f]" : "text-[#77736d]"}`} />
                  </div>
                  <div>
                    <p className="font-art-body text-sm font-semibold text-[#171717]">
                      {isDragging ? "Drop it here!" : "Drag & drop your image here"}
                    </p>
                    <p className="mt-1 font-art-body text-xs text-[#77736d]">
                      or{" "}
                      <span className="text-[#e4574f] underline underline-offset-2">click to browse</span>
                      {" "}· JPG, PNG, WebP · max {MAX_SIZE_MB} MB
                    </p>
                  </div>
                  {(uploadError || errors.image) && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                      <AlertCircle size={13} />
                      {uploadError || errors.image}
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-[#e5e1da] bg-white">
                  <div className="relative aspect-video w-full bg-[#f5f4f1]">
                    <Image
                      src={preview}
                      alt={fileName || "Artwork preview"}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); resetImage(); }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#55514c] shadow-md backdrop-blur-sm transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove image"
                    >
                      <X size={15} />
                    </button>
                    {uploadedUrl && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                        <CheckCircle2 size={11} />
                        Uploaded to CDN
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-art-body text-xs font-semibold text-[#171717]">{fileName}</p>
                      <p className="mt-0.5 font-art-body text-[10px] text-[#77736d]">
                        {uploadedUrl ? "Hosted on CDN" : "Will upload when you publish"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={resetImage}
                      className="shrink-0 rounded-lg border border-[#e5e1da] px-3 py-1.5 font-art-body text-[10px] font-medium text-[#55514c] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      Change image
                    </button>
                  </div>
                </div>
              )}
            </FormSection>

            {/* Section: Artwork Details */}
            <FormSection icon={<Tag size={15} />} label="Artwork Details" required>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel>Artwork Title <Req /></FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. Whispers of the Horizon"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => markTouched("title")}
                    className={`art-input ${errors.title ? "!border-red-400" : ""}`}
                  />
                  {errors.title && <FieldError>{errors.title}</FieldError>}
                </div>

                <div>
                  <FieldLabel>Category <Req /></FieldLabel>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="art-input appearance-none pr-9"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.emoji}  {c.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77736d]" />
                  </div>
                </div>

                <div>
                  <FieldLabel>Listing Status</FieldLabel>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="art-input appearance-none pr-9"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77736d]" />
                  </div>
                </div>

                <div>
                  <FieldLabel>Medium / Materials</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. Oil on Linen, Bronze, Generative 3D…"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className="art-input"
                  />
                </div>

                <div>
                  <FieldLabel>Year Created</FieldLabel>
                  <input
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="art-input"
                  />
                </div>
              </div>
            </FormSection>

            {/* Section: Pricing */}
            <FormSection icon={<DollarSign size={15} />} label="Pricing" required>
              <div className="max-w-xs">
                <FieldLabel>Price (USD) <Req /></FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-art-body text-sm font-semibold text-[#77736d]">$</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="2,500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={() => markTouched("price")}
                    className={`art-input pl-8 ${errors.price ? "!border-red-400" : ""}`}
                  />
                </div>
                {errors.price && <FieldError>{errors.price}</FieldError>}
                {netPayout && (
                  <p className="mt-1.5 font-art-body text-[11px] text-[#77736d]">
                    ArtHub takes a <strong>15%</strong> commission → you receive{" "}
                    <strong className="text-emerald-600">${netPayout}</strong>
                  </p>
                )}
              </div>
            </FormSection>

            {/* Section: Description */}
            <FormSection icon={<AlignLeft size={15} />} label="Description">
              <div>
                <FieldLabel>About This Artwork</FieldLabel>
                <textarea
                  rows={5}
                  maxLength={MAX_CHARS}
                  placeholder="Describe the medium, inspiration, dimensions, and story behind this piece…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="art-input resize-none"
                />
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="font-art-body text-[10px] text-[#77736d]">
                    Great descriptions help collectors connect with your work.
                  </p>
                  <span className={`font-art-body text-[10px] tabular-nums ${charCount > MAX_CHARS * 0.9 ? "text-[#e4574f]" : "text-[#77736d]"}`}>
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>
              </div>
            </FormSection>

            {/* Bottom action bar */}
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#e5e1da] bg-white px-6 py-4">
              <p className="font-art-body text-xs text-[#77736d]">
                {isValid ? "Everything looks good! Ready to publish." : "Complete the required fields to publish."}
              </p>
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 rounded-full bg-[#e4574f] px-6 py-2.5 font-art-body text-xs font-semibold text-white shadow-[0_4px_14px_rgba(228,87,79,0.28)] transition-all duration-200 hover:bg-[#ff7168] hover:shadow-[0_8px_24px_rgba(228,87,79,0.32)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Publishing…</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Publish Artwork</>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN — Live Preview + Checklist */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-[69px] lg:self-start">

            {/* Live Preview Card */}
            <div className="overflow-hidden rounded-2xl border border-[#e5e1da] bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#f0ede8] px-4 py-3">
                <Eye size={13} className="text-[#77736d]" />
                <span className="font-art-body text-[10px] font-semibold uppercase tracking-widest text-[#77736d]">Live Preview</span>
              </div>

              <div className="relative aspect-[4/3] w-full bg-[#f5f4f1]">
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5e1da]">
                      <ImageIcon size={20} className="text-[#77736d]" />
                    </div>
                    <p className="font-art-body text-[10px] text-[#77736d]">Upload an image to preview</p>
                  </div>
                )}
                {preview && (
                  <div className="absolute left-3 top-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm"
                      style={{ backgroundColor: (currentStatus?.dot ?? "#22c55e") + "cc" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      {currentStatus?.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-1 font-art-body text-[9px] font-semibold uppercase tracking-[0.15em] text-[#e4574f]">
                  {currentCategory?.emoji} {currentCategory?.label}
                </div>
                <h3 className="font-art-display text-lg font-semibold leading-tight tracking-tight text-[#171717]">
                  {title.trim() || <span className="italic text-[#c9c4bb]">Artwork Title</span>}
                </h3>
                <div className="mt-3">
                  <span className="font-art-display text-2xl font-semibold text-[#171717]">
                    {price && Number(price) > 0
                      ? `$${Number(price).toLocaleString()}`
                      : <span className="font-art-body text-sm italic text-[#c9c4bb]">Price TBD</span>
                    }
                  </span>
                </div>
                {description.trim() && (
                  <p className="mt-3 line-clamp-3 font-art-body text-[11px] leading-relaxed text-[#77736d]">
                    {description.trim()}
                  </p>
                )}
              </div>
            </div>

            {/* Publish Checklist */}
            <div className="rounded-2xl border border-[#e5e1da] bg-white p-4">
              <p className="mb-3 font-art-body text-[10px] font-semibold uppercase tracking-widest text-[#77736d]">
                Publish Checklist
              </p>
              <div className="flex flex-col gap-2.5">
                <CheckItem done={!!(preview || uploadedUrl)}>Artwork image uploaded</CheckItem>
                <CheckItem done={title.trim().length > 0}>Artwork title entered</CheckItem>
                <CheckItem done={!!price && Number(price) > 0}>Price set</CheckItem>
                <CheckItem done={description.trim().length >= 20}>Description (min 20 chars)</CheckItem>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="rounded-2xl border border-[#e5e1da] bg-[#fffaf7] p-4">
              <p className="mb-2.5 font-art-body text-[10px] font-semibold uppercase tracking-widest text-[#e4574f]">
                💡 Pro Tips
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "High-res images drive 3× more engagement.",
                  "Detailed descriptions build collector trust.",
                  "Consistent pricing builds your brand.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 font-art-body text-[11px] leading-relaxed text-[#55514c]">
                    <span className="mt-0.5 text-[#e4574f]">✦</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </form>
      </main>

      {/* Scoped field styles */}
      <style jsx global>{`
        .art-input {
          width: 100%;
          border-radius: 12px;
          border: 1.5px solid #e5e1da;
          background: white;
          padding: 10px 14px;
          font-family: var(--font-body, sans-serif);
          font-size: 13px;
          color: #171717;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .art-input:focus {
          border-color: #e4574f;
          box-shadow: 0 0 0 3px rgba(228, 87, 79, 0.1);
        }
        .art-input::placeholder {
          color: #c9c4bb;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   SUB-COMPONENTS
========================================================= */

function FormSection({ icon, label, required, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e1da] bg-white">
      <div className="flex items-center gap-2.5 border-b border-[#f0ede8] px-5 py-3.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e4574f]/10 text-[#e4574f]">
          {icon}
        </span>
        <span className="font-art-body text-sm font-semibold text-[#171717]">{label}</span>
        {required && (
          <span className="ml-auto rounded-full bg-[#f0ede8] px-2 py-0.5 font-art-body text-[9px] font-semibold uppercase tracking-widest text-[#77736d]">
            Required
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="mb-1.5 block font-art-body text-[10px] font-semibold uppercase tracking-wider text-[#55514c]">
      {children}
    </label>
  );
}

function Req() {
  return <span className="text-[#e4574f]">*</span>;
}

function FieldError({ children }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 font-art-body text-[11px] text-red-500">
      <AlertCircle size={11} />
      {children}
    </p>
  );
}

function CheckItem({ done, children }) {
  return (
    <div className={`flex items-center gap-2.5 font-art-body text-xs transition-all duration-300 ${done ? "text-[#171717]" : "text-[#c9c4bb]"}`}>
      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${done ? "bg-emerald-500" : "border border-[#d9d5ce] bg-white"}`}>
        {done && <CheckCircle2 size={10} className="text-white" strokeWidth={2.5} />}
      </div>
      {children}
    </div>
  );
}
