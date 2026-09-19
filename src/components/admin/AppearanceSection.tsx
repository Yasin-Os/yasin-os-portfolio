import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme, ACCENTS } from "@/lib/theme";
import { Sun, Moon, Check } from "lucide-react";
import { Field, inputCls } from "./ProfileSection";

export function AppearanceSection() {
  const { mode, toggleMode, accent, refreshAccent } = useTheme();
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [h, setH] = useState(accent.h);
  const [s, setS] = useState(accent.s);
  const [l, setL] = useState(accent.l);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("id, accent_h, accent_s, accent_l").limit(1).maybeSingle().then(({ data }) => {
      if (data) {
        setSettingsId(data.id);
        setH(data.accent_h ?? 244);
        setS(data.accent_s ?? 75);
        setL(data.accent_l ?? 60);
      }
    });
  }, []);

  // Live preview
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-h", String(h));
    root.style.setProperty("--accent-s", `${s}%`);
    root.style.setProperty("--accent-l", `${l}%`);
  }, [h, s, l]);

  const save = async () => {
    if (!settingsId) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ accent_h: h, accent_s: s, accent_l: l, updated_at: new Date().toISOString() })
      .eq("id", settingsId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Theme color saved");
    refreshAccent();
  };

  return (
    <div className="space-y-6">
      <Field label="Mode">
        <button
          onClick={toggleMode}
          className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm hover-lift"
        >
          {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          Switch to {mode === "dark" ? "light" : "dark"} mode
        </button>
      </Field>

      <Field label="Accent color presets">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {ACCENTS.map((a) => {
            const active = a.h === h && a.s === s && a.l === l;
            return (
              <button
                key={a.name}
                onClick={() => { setH(a.h); setS(a.s); setL(a.l); }}
                title={a.name}
                className={`relative aspect-square rounded-xl ring-2 transition-all ${active ? "ring-foreground" : "ring-transparent hover:ring-foreground/30"}`}
                style={{ background: `hsl(${a.h} ${a.s}% ${a.l}%)` }}
              >
                {active && <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow" />}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Custom hue" hint={`H ${h}° · S ${s}% · L ${l}%`}>
        <div className="space-y-2.5">
          <Slider label="Hue" min={0} max={360} value={h} onChange={setH} />
          <Slider label="Saturation" min={0} max={100} value={s} onChange={setS} />
          <Slider label="Lightness" min={20} max={80} value={l} onChange={setL} />
        </div>
      </Field>

      <div className="rounded-2xl border border-foreground/10 p-4 flex items-center gap-3">
        <div
          className="w-16 h-16 rounded-2xl shadow-lg"
          style={{ background: `hsl(${h} ${s}% ${l}%)` }}
        />
        <div className="text-sm">
          <p className="font-medium">Live preview</p>
          <p className="text-xs text-muted-foreground">All visitors will see this color across buttons, links, and accents.</p>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full sm:w-auto rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover-lift disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save theme color"}
      </button>
    </div>
  );
}

function Slider({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );
}
