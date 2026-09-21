import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.png";
import { AvatarCropper } from "./AvatarCropper";

type Profile = { id: string; name: string; title: string; bio: string; avatar_url: string | null; typing_arabic: string; typing_bangla: string; who_focus: string; who_personality: string; who_favourite_book: string; who_interests: string[]; };

export const inputCls = "w-full rounded-2xl bg-input/40 border border-foreground/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-input/60 transition-all";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ml-1">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground ml-1">{hint}</span>}
    </label>
  );
}

export function ProfileSection() {
  const [p, setP] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { supabase.from("profile").select("*").limit(1).maybeSingle().then(({ data }) => { if (data) setP(data as Profile); }); }, []);

  if (!p) return <div className="animate-pulse h-40 bg-muted rounded-3xl" />;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profile").update({ ...p, updated_at: new Date().toISOString() }).eq("id", p.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile saved successfully");
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col items-center gap-4 bg-muted/30 p-6 rounded-3xl border border-foreground/5">
        <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
          <img src={p.avatar_url || defaultAvatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-xl group-hover:scale-105 transition-transform" loading="lazy" />
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={24} />
          </div>
        </div>
        {p.avatar_url && (
          <button onClick={() => setP({ ...p, avatar_url: null })} className="text-xs text-destructive flex items-center gap-1 hover:bg-destructive/10 px-3 py-1.5 rounded-full transition-colors"><Trash2 size={14}/> Remove Photo</button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onload = () => setCropSrc(r.result as string); r.readAsDataURL(f); } }} />
      </div>

      <div className="space-y-5">
        <Field label="Full Name"><input className={inputCls} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></Field>
        <Field label="Tagline / Badge" hint="Appears above your name on home page."><input className={inputCls} value={p.title ?? ""} onChange={(e) => setP({ ...p, title: e.target.value })} /></Field>
        <Field label="Biography"><textarea rows={4} className={inputCls} value={p.bio ?? ""} onChange={(e) => setP({ ...p, bio: e.target.value })} /></Field>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-3xl p-5 sm:p-6 space-y-5">
        <h3 className="font-semibold text-primary">Animated Typing Text</h3>
        <Field label="Arabic Greeting"><input dir="rtl" className={inputCls + " font-medium text-lg"} value={p.typing_arabic} onChange={(e) => setP({ ...p, typing_arabic: e.target.value })} /></Field>
        <Field label="Bangla Translation"><textarea rows={2} className={inputCls} value={p.typing_bangla} onChange={(e) => setP({ ...p, typing_bangla: e.target.value })} /></Field>
      </div>

      <div className="bg-muted/30 border border-foreground/10 rounded-3xl p-5 sm:p-6 space-y-5">
        <h3 className="font-semibold">Terminal JSON Details</h3>
        <Field label="Focus"><input className={inputCls} value={p.who_focus} onChange={(e) => setP({ ...p, who_focus: e.target.value })} /></Field>
        <Field label="Personality"><input className={inputCls} value={p.who_personality} onChange={(e) => setP({ ...p, who_personality: e.target.value })} /></Field>
        <Field label="Favourite Book"><input className={inputCls} value={p.who_favourite_book} onChange={(e) => setP({ ...p, who_favourite_book: e.target.value })} /></Field>
        <Field label="Interests (Comma separated)"><input className={inputCls} value={p.who_interests.join(", ")} onChange={(e) => setP({ ...p, who_interests: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} /></Field>
      </div>

      <div className="sticky bottom-4 z-10">
        <button onClick={save} disabled={saving} className="w-full shadow-2xl rounded-2xl bg-primary text-primary-foreground px-6 py-4 text-sm font-bold hover:scale-[1.02] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
          {saving ? "Saving Changes..." : "Save Profile Updates"}
        </button>
      </div>

      <AvatarCropper open={!!cropSrc} imageSrc={cropSrc ?? ""} onClose={() => setCropSrc(null)} onCropped={(url) => setP({ ...p, avatar_url: url })} />
    </div>
  );
}
