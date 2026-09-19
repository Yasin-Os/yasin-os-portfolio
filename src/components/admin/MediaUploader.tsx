import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

type Props = {
  /** Sub-folder inside the media bucket (e.g. "avatars", "works", "audio"). */
  folder: string;
  /** Accepted MIME wildcard (e.g. "image/*", "video/*", "audio/*", or "*"). */
  accept?: string;
  /** Optional preview thumbnail (image url). */
  previewUrl?: string | null;
  /** Called with the public URL after upload. */
  onUploaded: (publicUrl: string, file: File) => void;
  label?: string;
  className?: string;
};

/** Direct gallery / file upload to the public "media" Lovable Cloud Storage bucket. */
export function MediaUploader({ folder, accept = "*", previewUrl, onUploaded, label = "Upload from gallery", className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking same file
    if (!file) return;
    setBusy(true);
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${folder}/${Date.now()}_${safeName}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      upsert: false,
      contentType: file.type || undefined,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
    onUploaded(pub.publicUrl, file);
    toast.success("Uploaded");
  };

  const isImage = previewUrl && /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(previewUrl);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {previewUrl && isImage ? (
        <img src={previewUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-foreground/10" />
      ) : previewUrl ? (
        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-[10px] text-muted-foreground border border-foreground/10">
          file
        </div>
      ) : null}
      <button
        type="button"
        onClick={handlePick}
        disabled={busy}
        className="flex items-center gap-2 rounded-xl bg-secondary text-secondary-foreground px-3 py-2 text-xs hover-lift disabled:opacity-60"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {busy ? "Uploading…" : label}
      </button>
      <input ref={inputRef} type="file" accept={accept} hidden onChange={handleFile} />
    </div>
  );
}
