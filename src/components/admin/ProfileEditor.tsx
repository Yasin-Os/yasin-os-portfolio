import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Profile = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar_url: string | null;
  greeting_arabic: string;
  rank: string;
  status: string;
  hobbies: string[];
};

export function ProfileEditor() {
  const [p, setP] = useState<Profile | null>(null);
  const [hobbiesText, setHobbiesText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) {
        setP(data as Profile);
        setHobbiesText((data.hobbies ?? []).join(", "));
      }
    });
  }, []);

  if (!p) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const update = <K extends keyof Profile>(k: K, v: Profile[K]) => setP({ ...p, [k]: v });

  const save = async () => {
    setSaving(true);
    const hobbies = hobbiesText.split(",").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase
      .from("profile")
      .update({
        name: p.name,
        title: p.title,
        tagline: p.tagline,
        bio: p.bio,
        avatar_url: p.avatar_url,
        greeting_arabic: p.greeting_arabic,
        rank: p.rank,
        status: p.status,
        hobbies,
        updated_at: new Date().toISOString(),
      })
      .eq("id", p.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  return (
    <div className="space-y-4">
      <Row label="Name">
        <input className={inputCls} value={p.name} onChange={(e) => update("name", e.target.value)} />
      </Row>
      <Row label="Title / Role">
        <input className={inputCls} value={p.title} onChange={(e) => update("title", e.target.value)} />
      </Row>
      <Row label="Tagline">
        <input className={inputCls} value={p.tagline} onChange={(e) => update("tagline", e.target.value)} />
      </Row>
      <Row label="Bio">
        <textarea className={inputCls} rows={3} value={p.bio} onChange={(e) => update("bio", e.target.value)} />
      </Row>
      <Row label="Avatar URL">
        <input className={inputCls} placeholder="https://…" value={p.avatar_url ?? ""} onChange={(e) => update("avatar_url", e.target.value)} />
      </Row>
      <Row label="Arabic greeting">
        <input dir="rtl" className={inputCls} value={p.greeting_arabic} onChange={(e) => update("greeting_arabic", e.target.value)} />
      </Row>
      <Row label="Rank (about JSON)">
        <input className={inputCls} value={p.rank} onChange={(e) => update("rank", e.target.value)} />
      </Row>
      <Row label="Status (about JSON)">
        <input className={inputCls} value={p.status} onChange={(e) => update("status", e.target.value)} />
      </Row>
      <Row label="Hobbies (comma-separated)">
        <input className={inputCls} value={hobbiesText} onChange={(e) => setHobbiesText(e.target.value)} />
      </Row>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-xl bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover-lift disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </div>
  );
}

export const inputCls =
  "w-full rounded-lg bg-input/60 border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
