import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, X, ZoomIn, ZoomOut } from "lucide-react";

type Props = {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropped: (publicUrl: string) => void;
};

async function getCroppedBlob(src: string, area: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
  const size = Math.min(area.width, area.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Failed to crop"))), "image/jpeg", 0.92)
  );
}

export function AvatarCropper({ open, imageSrc, onClose, onCropped }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_: Area, px: Area) => setArea(px), []);

  if (!open) return null;

  const save = async () => {
    if (!area) return;
    setBusy(true);
    try {
      const blob = await getCroppedBlob(imageSrc, area);
      const path = `avatars/${Date.now()}_cropped.jpg`;
      const { error } = await supabase.storage.from("media").upload(path, blob, {
        upsert: false,
        contentType: "image/jpeg",
      });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      onCropped(pub.publicUrl);
      toast.success("Photo updated");
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Could not crop");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-card border border-foreground/10 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Adjust photo</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-foreground/10"><X size={16} /></button>
        </div>

        <div className="relative w-full aspect-square bg-black/40 rounded-2xl overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ZoomOut size={16} className="text-muted-foreground" />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <ZoomIn size={16} className="text-muted-foreground" />
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl glass px-4 py-2.5 text-sm">Cancel</button>
          <button
            onClick={save}
            disabled={busy}
            className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover-lift disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {busy ? "Saving…" : "Use photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
