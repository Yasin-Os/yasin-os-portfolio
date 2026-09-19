import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Video, Palette, AudioLines, Code2, Smartphone, Sparkles, GraduationCap, BookOpen, ChevronLeft, Plus, Trash2, Pencil, Loader2, Link2, X } from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import { Field, inputCls } from "./ProfileSection";

type Category = "website" | "app" | "graphic" | "video" | "audio" | "ai" | "tutorial" | "islam" | "other";

const CATEGORIES: { key: Category; label: string; Icon: typeof Video; tint: string }[] = [
  { key: "video", label: "Video", Icon: Video, tint: "from-rose-500/20 to-orange-500/20" },
  { key: "graphic", label: "Graphics", Icon: Palette, tint: "from-fuchsia-500/20 to-purple-500/20" },
  { key: "audio", label: "Audio", Icon: AudioLines, tint: "from-emerald-500/20 to-teal-500/20" },
  { key: "website", label: "Website", Icon: Code2, tint: "from-sky-500/20 to-blue-500/20" },
  { key: "app", label: "App", Icon: Smartphone, tint: "from-indigo-500/20 to-violet-500/20" },
  { key: "ai", label: "AI", Icon: Sparkles, tint: "from-amber-500/20 to-yellow-500/20" },
  { key: "tutorial", label: "Tutorial", Icon: GraduationCap, tint: "from-cyan-500/20 to-blue-500/20" },
  { key: "islam", label: "Islam", Icon: BookOpen, tint: "from-green-500/20 to-emerald-500/20" },
];

type Work = {
  id: string;
  title: string;
  description: string | null;
  category: Category;
  cover_url: string | null;
  link_url: string | null;
  media_url: string | null;
  sort_order: number;
};

export function WorkSection() {
  const [active, setActive] = useState<Category | null>(null);
  if (!active) return <CategoryGrid onPick={setActive} />;
  return <CategoryDetail category={active} onBack={() => setActive(null)} />;
}

function CategoryGrid({ onPick }: { onPick: (c: Category) => void }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    supabase.from("works").select("category").then(({ data }) => {
      const c: Record<string, number> = {};
      (data ?? []).forEach((r) => { c[r.category as string] = (c[r.category as string] ?? 0) + 1; });
      setCounts(c);
    });
  }, []);
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">Pick a category to manage posts.</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-w-md mx-auto">
        {CATEGORIES.map(({ key, label, Icon, tint }) => (
          <button
            key={key}
            onClick={() => onPick(key)}
            className={`relative rounded-xl border border-foreground/10 bg-gradient-to-br ${tint} backdrop-blur p-2.5 flex flex-col items-center justify-center gap-1 aspect-square hover:border-primary/40 hover:scale-[1.03] transition-all`}
          >
            <div className="rounded-full bg-background/60 p-1.5">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-semibold leading-tight">{label}</span>
            <span className="text-[9px] text-muted-foreground">{counts[key] ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function emptyWork(category: Category): Omit<Work, "id"> {
  return { title: "", description: "", category, cover_url: null, link_url: null, media_url: null, sort_order: 0 };
}

function CategoryDetail({ category, onBack }: { category: Category; onBack: () => void }) {
  const cat = CATEGORIES.find((c) => c.key === category)!;
  const [items, setItems] = useState<Work[]>([]);
  const [editing, setEditing] = useState<Work | (Omit<Work, "id"> & { id?: string }) | null>(null);

  const load = () => {
    supabase
      .from("works")
      .select("*")
      .eq("category", category)
      .order("sort_order")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Work[]) ?? []));
  };
  useEffect(load, [category]);

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("works").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} /> All categories
        </button>
        <button
          onClick={() => setEditing(emptyWork(category))}
          className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover-lift"
        >
          <Plus size={14} /> New post
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="rounded-lg bg-secondary p-2"><cat.Icon size={18} /></span>
        <h3 className="text-lg font-semibold">{cat.label}</h3>
        <span className="text-xs text-muted-foreground">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts in this category yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((w) => (
            <li key={w.id} className="glass rounded-xl p-3 flex items-center gap-3">
              {w.cover_url ? (
                <img src={w.cover_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{w.title || "Untitled"}</p>
                <p className="text-xs text-muted-foreground truncate">{w.description || w.link_url || w.media_url || "—"}</p>
              </div>
              <button onClick={() => setEditing(w)} className="p-2 rounded-lg hover:bg-foreground/10" aria-label="Edit">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(w.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10" aria-label="Delete">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <WorkEditor
          value={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function WorkEditor({
  value,
  onClose,
  onSaved,
}: {
  value: Work | (Omit<Work, "id"> & { id?: string });
  onClose: () => void;
  onSaved: () => void;
}) {
  const [w, setW] = useState(value);
  const [saving, setSaving] = useState(false);
  const [ogBusy, setOgBusy] = useState(false);

  const set = <K extends keyof typeof w>(k: K, v: (typeof w)[K]) => setW({ ...w, [k]: v });

  const cat = w.category as Category;
  const isVideo = cat === "video";
  const isAudio = cat === "audio";
  const isApp = cat === "app";
  const isWebsite = cat === "website";

  const fetchOg = async () => {
    if (!w.link_url) return toast.error("Paste a URL first");
    setOgBusy(true);
    try {
      const res = await fetch(`/api/public/og?url=${encodeURIComponent(w.link_url)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setW({
        ...w,
        title: w.title || data.title || "",
        description: w.description || data.description || "",
        cover_url: w.cover_url || data.image || null,
      });
      toast.success("Loaded from link");
    } catch (e: any) {
      toast.error(e.message || "Could not fetch link preview");
    } finally {
      setOgBusy(false);
    }
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      title: w.title?.trim() || "Untitled",
      description: w.description,
      category: w.category,
      cover_url: w.cover_url,
      link_url: w.link_url,
      media_url: w.media_url,
      sort_order: w.sort_order ?? 0,
    };
    const q = "id" in w && w.id
      ? supabase.from("works").update(payload).eq("id", w.id)
      : supabase.from("works").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
      <div className="w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-2xl bg-card border border-foreground/10 p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{"id" in w && w.id ? "Edit post" : "New post"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-foreground/10"><X size={16} /></button>
        </div>

        <div className="space-y-3">
          {/* Media — depends on category */}
          {(isVideo || isAudio) && (
            <Field label={isVideo ? "Video file" : "Audio file"}>
              <MediaUploader
                folder={isVideo ? "videos" : "audio"}
                accept={isVideo ? "video/*" : "audio/*"}
                previewUrl={w.media_url}
                label={w.media_url ? "Replace file" : "Pick file"}
                onUploaded={(url) => set("media_url", url)}
              />
            </Field>
          )}

          {isApp && (
            <Field label="App file (APK / installer)">
              <MediaUploader
                folder="apps"
                accept=".apk,.aab,.ipa,.exe,.dmg,.zip,application/*"
                previewUrl={w.media_url}
                label={w.media_url ? "Replace file" : "Pick app file"}
                onUploaded={(url) => set("media_url", url)}
              />
            </Field>
          )}

          {/* Link with OG fetch */}
          <Field label={isWebsite ? "Website link" : "External link (optional)"}>
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={w.link_url ?? ""}
                onChange={(e) => set("link_url", e.target.value)}
                placeholder="https://…"
                inputMode="url"
              />
              <button
                type="button"
                onClick={fetchOg}
                disabled={ogBusy || !w.link_url}
                className="shrink-0 flex items-center gap-1 rounded-xl bg-secondary px-3 text-xs font-medium hover-lift disabled:opacity-50"
              >
                {ogBusy ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
                Fetch
              </button>
            </div>
          </Field>

          <Field label="Title (optional)">
            <input
              className={inputCls}
              value={w.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Untitled"
            />
          </Field>

          <Field label="Description (optional)">
            <textarea rows={2} className={inputCls} value={w.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <Field label="Cover image (optional)">
            <MediaUploader
              folder="covers"
              accept="image/*"
              previewUrl={w.cover_url}
              label={w.cover_url ? "Replace cover" : "Pick cover"}
              onUploaded={(url) => set("cover_url", url)}
            />
          </Field>

          <details className="group">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground select-none">
              Advanced
            </summary>
            <div className="mt-2">
              <Field label="Sort order">
                <input
                  type="number"
                  className={inputCls}
                  value={w.sort_order ?? 0}
                  onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
                />
              </Field>
            </div>
          </details>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl glass px-4 py-2 text-sm">Cancel</button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover-lift disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save post"}
          </button>
        </div>
      </div>
    </div>
  );
}
