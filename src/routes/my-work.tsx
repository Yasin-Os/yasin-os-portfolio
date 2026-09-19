import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Smartphone, Palette, Video, Music, Box, ExternalLink, Sparkles, GraduationCap, BookOpen } from "lucide-react";

const CATEGORY_KEYS = ["all", "website", "app", "graphic", "video", "audio", "ai", "tutorial", "islam", "other"] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const Route = createFileRoute("/my-work")({
  validateSearch: (search: Record<string, unknown>): { category: CategoryKey } => {
    const c = String(search.category ?? "all");
    return { category: (CATEGORY_KEYS as readonly string[]).includes(c) ? (c as CategoryKey) : "all" };
  },
  head: () => ({
    meta: [
      { title: "My Work — Yasin Adnan" },
      { name: "description", content: "Websites, apps, graphics, video, audio — everything I create." },
      { property: "og:title", content: "My Work — Yasin Adnan" },
      { property: "og:description", content: "Websites, apps, graphics, video, audio — everything I create." },
    ],
  }),
  component: MyWork,
});

type Work = {
  id: string;
  title: string;
  description: string | null;
  category: Exclude<CategoryKey, "all">;
  cover_url: string | null;
  link_url: string | null;
  media_url: string | null;
};

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "website", label: "Websites" },
  { key: "app", label: "Apps" },
  { key: "graphic", label: "Graphics" },
  { key: "video", label: "Video" },
  { key: "audio", label: "Audio" },
  { key: "ai", label: "AI" },
  { key: "tutorial", label: "Tutorial" },
  { key: "islam", label: "Islam" },
  { key: "other", label: "Other" },
] as const;

const ICONS: Record<Work["category"], typeof Globe> = {
  website: Globe,
  app: Smartphone,
  graphic: Palette,
  video: Video,
  audio: Music,
  ai: Sparkles,
  tutorial: GraduationCap,
  islam: BookOpen,
  other: Box,
};

function MyWork() {
  const { category: initial } = Route.useSearch();
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState<CategoryKey>(initial);

  useEffect(() => {
    setFilter(initial);
  }, [initial]);

  useEffect(() => {
    supabase
      .from("works")
      .select("id, title, description, category, cover_url, link_url, media_url")
      .order("sort_order")
      .order("created_at", { ascending: false })
      .then(({ data }) => setWorks((data as Work[]) ?? []));
  }, []);

  const filtered = filter === "all" ? works : works.filter((w) => w.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">My Work</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
          {CATEGORIES.find((c) => c.key === filter)?.label ?? "All"}
        </h1>
      </header>

      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-muted-foreground">
          No items yet. Add your work from the admin panel.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((w) => (
            <WorkCard key={w.id} work={w} />
          ))}
        </div>
      )}
    </div>
  );
}

const isVideoUrl = (u?: string | null) => !!u && /\.(mp4|mov|webm|m4v|ogv)(\?|$)/i.test(u);
const isAudioUrl = (u?: string | null) => !!u && /\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/i.test(u);

function WorkCard({ work }: { work: Work }) {
  const Icon = ICONS[work.category];

  // Resolve effective sources — be forgiving if admin uploaded the media into cover_url.
  const videoSrc = isVideoUrl(work.media_url) ? work.media_url
                 : work.category === "video" && isVideoUrl(work.cover_url) ? work.cover_url
                 : null;
  const audioSrc = isAudioUrl(work.media_url) ? work.media_url
                 : work.category === "audio" && isAudioUrl(work.cover_url) ? work.cover_url
                 : null;
  const imageSrc = !isVideoUrl(work.cover_url) && !isAudioUrl(work.cover_url) ? work.cover_url : null;

  const Media = () => {
    if (videoSrc) {
      return (
        <video
          src={videoSrc}
          poster={imageSrc ?? undefined}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-contain bg-black"
        />
      );
    }
    if (audioSrc) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500 p-4">
          {imageSrc ? (
            <img src={imageSrc} alt={work.title} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <Music size={48} />
          )}
          <audio src={audioSrc} controls preload="metadata" className="w-full max-w-xs" />
        </div>
      );
    }
    if (imageSrc) {
      return <img src={imageSrc} alt={work.title} loading="lazy" className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <Icon size={48} />
      </div>
    );
  };

  const primaryHref = work.link_url || (work.category === "app" ? work.media_url : null);

  return (
    <article className="glass rounded-3xl overflow-hidden hover-lift group">
      <div className="aspect-[4/3] bg-muted/40 overflow-hidden">
        <Media />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
          <Icon size={12} />
          <span>{work.category}</span>
        </div>
        {work.title && work.title !== "Untitled" && (
          <h3 className="mt-1 text-base font-semibold">{work.title}</h3>
        )}
        {work.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{work.description}</p>
        )}
        {work.category === "app" && work.media_url && (
          <a
            href={work.media_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover-lift"
          >
            Download <ExternalLink size={12} />
          </a>
        )}
        {primaryHref && work.category !== "app" && (
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
}
