import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import { Field, inputCls } from "./ProfileSection";

type Img = { id: string; image_url: string; caption: string | null; sort_order: number };

/** Admin section — manages the Visual Journey gallery (gallery_images). */
export function GallerySection() {
  const [items, setItems] = useState<Img[]>([]);
  const [adding, setAdding] = useState<{ image_url: string; caption: string } | null>(null);

  const load = () => {
    supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setItems((data as Img[]) ?? []));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm("Remove this photo?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    load();
  };

  const save = async () => {
    if (!adding?.image_url) return toast.error("Pick a photo first");
    const { error } = await supabase.from("gallery_images").insert({
      image_url: adding.image_url,
      caption: adding.caption || null,
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setAdding(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Photos shown in Visual Journey on your homepage.</p>
        <button
          onClick={() => setAdding({ image_url: "", caption: "" })}
          className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover-lift"
        >
          <Plus size={14} /> Add photo
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photos yet.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((img) => (
            <li key={img.id} className="relative group rounded-2xl overflow-hidden border border-foreground/10">
              <img src={img.image_url} alt={img.caption ?? ""} className="aspect-square w-full object-cover" />
              {img.caption && (
                <span className="absolute inset-x-0 bottom-0 text-[11px] bg-gradient-to-t from-black/70 to-transparent text-white p-2 line-clamp-1">
                  {img.caption}
                </span>
              )}
              <button
                onClick={() => remove(img.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/90 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card border border-foreground/10 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Add a photo</h3>
              <button onClick={() => setAdding(null)} className="p-1.5 rounded-lg hover:bg-foreground/10"><X size={16} /></button>
            </div>

            <Field label="Photo">
              <MediaUploader
                folder="gallery"
                accept="image/*"
                previewUrl={adding.image_url}
                label={adding.image_url ? "Replace photo" : "Pick photo"}
                onUploaded={(url) => setAdding({ ...adding, image_url: url })}
              />
            </Field>

            <div className="mt-4">
              <Field label="Caption (optional)">
                <input
                  className={inputCls}
                  value={adding.caption}
                  onChange={(e) => setAdding({ ...adding, caption: e.target.value })}
                  placeholder="A short caption…"
                />
              </Field>
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setAdding(null)} className="flex-1 rounded-xl glass px-4 py-2.5 text-sm">Cancel</button>
              <button onClick={save} className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover-lift">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
