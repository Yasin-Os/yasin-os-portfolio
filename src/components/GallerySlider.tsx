import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Auto-rotating image gallery — fades between images every 3s. */
export function GallerySlider() {
  const [images, setImages] = useState<{ id: string; image_url: string; caption: string | null }[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("id, image_url, caption")
      .order("sort_order")
      .then(({ data }) => setImages(data ?? []));
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length]);

  if (!images.length) {
    return null;
  }

  return (
    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden glass">
      {images.map((img, i) => (
        <img
          key={img.id}
          src={img.image_url}
          alt={img.caption || `Gallery image ${i + 1}`}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
