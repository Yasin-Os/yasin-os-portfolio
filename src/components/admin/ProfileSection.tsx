import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.png";
import { AvatarCropper } from "./AvatarCropper";

type Profile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  typing_arabic: string;
  typing_bangla: string;
  who_focus: string;
  who_personality: string;
  who_favourite_book: string;
  who_interests: string[];
};

export function ProfileSection() {
  const [p, setP] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) setP(data as Profile);
    });
  }, []);

  if (!p) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profile")
      .update({
        name: p.name,
        title: p.title,
        bio: p.bio,
        avatar_url: p.avatar_url,
        typing_arabic: p.typing_arabic,
        typing_bangla: p.typing_bangla,
        who_focus: p.who_focus,
        who_personality: p.who_personality,
        who_favourite_book: p.who_favourite_book,
        who_interests: p.who_interests,
        updated_at: new Date().toISOString(),
      })
      .eq("id", p.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={p.avatar_url || defaultAvatar}
            alt={p.name}
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-primary/30 shadow-[var(--shadow-glow)]"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-1 right-1 rounded-full bg-primary text-primary-foreground p-2 shadow-lg hover-lift"
            aria-label="Change photo"
          >
            <Camera size={14} />
          </button>
        </div>
        {p.avatar_url && (
          <button
            onClick={() => setP({ ...p, avatar_url: null })}
            className="flex items-center gap-1 text-xs text-destructive hover:underline"
          >
            <Trash2 size={12} /> Remove photo
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickFile} />
      </div>

      <Field label="Name">
        <input
          className={inputCls}
          value={p.name}
          onChange={(e) => setP({ ...p, name: e.target.value })}
        />
      </Field>

      <Field label="Badge / Tagline" hint="The small pill shown above your name on the homepage (e.g. Tech Enthusiast).">
        <input
          className={inputCls}
          value={p.title ?? ""}
          onChange={(e) => setP({ ...p, title: e.target.value })}
          placeholder="Tech Enthusiast"
        />
      </Field>

      <Field label="Bio" hint="Short intro shown in the Who Am I section.">
        <textarea
          rows={4}
          className={inputCls}
          value={p.bio ?? ""}
          onChange={(e) => setP({ ...p, bio: e.target.value })}
          placeholder="Tell visitors a little about yourself…"
        />
      </Field>


      <Field label="Typing — Arabic" hint="The Arabic line that types under your name (animation stays the same).">
        <textarea
          rows={2}
          dir="rtl"
          lang="ar"
          className={inputCls + " font-medium"}
          value={p.typing_arabic}
          onChange={(e) => setP({ ...p, typing_arabic: e.target.value })}
        />
      </Field>

      <Field label="Typing — Bangla / English" hint="Second typed phrase shown after the Arabic.">
        <textarea
          rows={2}
          className={inputCls}
          value={p.typing_bangla}
          onChange={(e) => setP({ ...p, typing_bangla: e.target.value })}
        />
      </Field>

      <div className="rounded-2xl border border-foreground/10 p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Who Am I — JSON card</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">These fields appear in the homepage code-window.</p>
        </div>

        <Field label="Focus">
          <input className={inputCls} value={p.who_focus}
            onChange={(e) => setP({ ...p, who_focus: e.target.value })} />
        </Field>
        <Field label="Personality">
          <input className={inputCls} value={p.who_personality}
            onChange={(e) => setP({ ...p, who_personality: e.target.value })} />
        </Field>
        <Field label="Favourite book">
          <input className={inputCls} value={p.who_favourite_book}
            onChange={(e) => setP({ ...p, who_favourite_book: e.target.value })} />
        </Field>
        <Field label="Interests (comma-separated)">
          <input
            className={inputCls}
            value={p.who_interests.join(", ")}
            onChange={(e) => setP({ ...p, who_interests: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
          />
        </Field>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="btn-anim w-full sm:w-auto rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>

      <AvatarCropper
        open={!!cropSrc}
        imageSrc={cropSrc ?? ""}
        onClose={() => setCropSrc(null)}
        onCropped={(url) => setP({ ...p, avatar_url: url })}
      />
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl bg-input/60 border border-foreground/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
