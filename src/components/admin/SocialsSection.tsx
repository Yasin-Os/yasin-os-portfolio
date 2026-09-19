import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BRANDS, detectFromUrl } from "@/lib/social-brands";
import { Plus, Trash2, X } from "lucide-react";
import { Field, inputCls } from "./ProfileSection";

type Social = { id: string; platform: string; url: string; icon: string | null; sort_order: number };

export function SocialsSection() {
  const [items, setItems] = useState<Social[]>([]);
  const [adding, setAdding] = useState<{ platformKey: string; url: string } | null>(null);

  const load = () => {
    supabase.from("social_links").select("*").order("sort_order").then(({ data }) => setItems((data as Social[]) ?? []));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm("Remove this link?")) return;
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    load();
  };

  const save = async () => {
    if (!adding) return;
    const { platformKey, url } = adding;
    if (!url.trim()) return toast.error("Paste a URL");
    const brand = BRANDS[platformKey] ?? BRANDS.website;
    const { error } = await supabase.from("social_links").insert({
      platform: brand.name,
      url: url.trim(),
      icon: platformKey,
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
        <p className="text-sm text-muted-foreground">Pick a platform, paste your link, done.</p>
        <button
          onClick={() => setAdding({ platformKey: "facebook", url: "" })}
          className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover-lift"
        >
          <Plus size={14} /> Add link
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((s) => {
          const b = BRANDS[s.icon ?? ""] ?? BRANDS[detectFromUrl(s.url) ?? "website"];
          return (
            <li key={s.id} className="glass rounded-xl p-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${b.color} 18%, transparent)` }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill={b.color}><path d={b.path} /></svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.platform}</p>
                <p className="text-xs text-muted-foreground truncate">{s.url}</p>
              </div>
              <button onClick={() => remove(s.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10" aria-label="Remove">
                <Trash2 size={14} />
              </button>
            </li>
          );
        })}
        {items.length === 0 && <li className="text-sm text-muted-foreground">No social links yet.</li>}
      </ul>

      {adding && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card border border-foreground/10 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Add a social link</h3>
              <button onClick={() => setAdding(null)} className="p-1.5 rounded-lg hover:bg-foreground/10"><X size={16} /></button>
            </div>

            <Field label="Platform">
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(BRANDS).map(([key, b]) => {
                  const active = adding.platformKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setAdding({ ...adding, platformKey: key })}
                      className={`flex flex-col items-center gap-1 rounded-xl p-2 border transition-all ${active ? "border-primary bg-primary/10" : "border-foreground/10 hover:border-foreground/30"}`}
                      title={b.name}
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill={b.color}><path d={b.path} /></svg>
                      <span className="text-[10px] truncate w-full text-center">{b.name}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="mt-4">
              <Field label="URL">
                <input
                  className={inputCls}
                  value={adding.url}
                  onChange={(e) => setAdding({ ...adding, url: e.target.value })}
                  placeholder="https://…"
                  inputMode="url"
                  autoFocus
                />
              </Field>
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setAdding(null)} className="flex-1 rounded-xl glass px-4 py-2.5 text-sm">Cancel</button>
              <button onClick={save} className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover-lift">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
