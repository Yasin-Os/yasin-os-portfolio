import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";
import { resolveBrand } from "@/lib/social-brands";

type Social = { id: string; platform: string; url: string; icon: string | null };

export function SocialLinks() {
  const [items, setItems] = useState<Social[]>([]);
  useEffect(() => {
    supabase
      .from("social_links")
      .select("id, platform, url, icon")
      .order("sort_order")
      .then(({ data }) => setItems(data ?? []));
  }, []);

  if (!items.length) return null;

  return (
    <ul className="w-full max-w-md mx-auto flex flex-col gap-3">
      {items.map((s) => {
        const brand = resolveBrand(s.platform, s.icon);
        let host = s.url;
        try { host = new URL(s.url).hostname.replace(/^www\./, ""); } catch {}
        return (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="btn-anim group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-foreground/10 bg-card/40 backdrop-blur px-4 py-3.5 hover:border-foreground/20 hover:bg-card/70"
            >
              <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-70 transition-all group-hover:w-1.5" style={{ background: brand.color }} />
              <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `radial-gradient(120% 80% at 0% 50%, ${brand.color}22, transparent 60%)` }} />
              <span
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform group-hover:scale-105"
                style={{
                  background: `color-mix(in oklab, ${brand.color} 14%, transparent)`,
                  boxShadow: `0 6px 24px -10px ${brand.color}80`,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden fill={brand.color}>
                  <path d={brand.path} />
                </svg>
              </span>
              <span className="relative flex-1 min-w-0">
                <span className="block text-base font-semibold text-foreground truncate">{s.platform}</span>
                <span className="block text-xs text-muted-foreground truncate">{host}</span>
              </span>
              <ArrowUpRight size={18} className="relative shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
