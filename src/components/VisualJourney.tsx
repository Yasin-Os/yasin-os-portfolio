import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ImageIcon } from "lucide-react";

type Img = { id: string; image_url: string; caption: string | null };

/**
 * Visual Journey — photo carousel rendered below the My Work title.
 * Admin manages photos from the admin panel (gallery_images table).
 */
export function VisualJourney() {
  const [images, setImages] = useState<Img[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }));

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("id, image_url, caption")
      .order("sort_order")
      .then(({ data }) => setImages((data as Img[]) ?? []));
  }, []);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (images.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-foreground/15 p-6 text-center text-sm text-muted-foreground">
        <ImageIcon className="mx-auto mb-2 opacity-60" size={22} />
        Add photos from the admin panel to fill your Visual Journey.
      </div>
    );
  }

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true }}
        plugins={[autoplay.current]}
        className="w-full max-w-md mx-auto"
      >
        <CarouselContent>
          {images.map((img, idx) => (
            <CarouselItem key={img.id}>
              <figure className="relative aspect-[4/5] rounded-3xl overflow-hidden glass shadow-[var(--shadow-glow)]">
                <img
                  src={img.image_url}
                  alt={img.caption || "Visual journey photo"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                {img.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white text-sm p-4">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex justify-center gap-1.5">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Photo ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              selected === i ? "w-6 bg-primary" : "w-1.5 bg-primary/30 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
