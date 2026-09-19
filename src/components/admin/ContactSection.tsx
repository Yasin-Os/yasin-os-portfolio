import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, X, Mail, Phone, MessageCircle, MapPin, Globe } from "lucide-react";
import { Field, inputCls } from "./ProfileSection";

type Entry = { id: string; label: string; value: string; href: string | null; sort_order: number };

const PRESETS: { key: string; label: string; Icon: typeof Mail; hrefPrefix: string; placeholder: string }[] = [
  { key: "email", label: "Email", Icon: Mail, hrefPrefix: "mailto:", placeholder: "you@example.com" },
  { key: "phone", label: "Phone", Icon: Phone, hrefPrefix: "tel:", placeholder: "+8801XXXXXXXXX" },
  { key: "whatsapp", label: "WhatsApp", Icon: MessageCircle, hrefPrefix: "https://wa.me/", placeholder: "8801XXXXXXXXX" },
  { key: "location", label: "Location", Icon: MapPin, hrefPrefix: "https://maps.google.com/?q=", placeholder: "City, Country" },
  { key: "website", label: "Website", Icon: Globe, hrefPrefix: "https://", placeholder: "yourdomain.com" },
];

/** Admin section — manages contact_entries (used by Get In Touch + /contact). */
export function ContactSection() {
  const [items, setItems] = useState<Entry[]>([]);
  const [adding, setAdding] = useState<{ presetKey: string; value: string } | null>(null);

  const load = () => {
    supabase
      .from("contact_entries")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setItems((data as Entry[]) ?? []));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm("Remove this contact?")) return;
    const { error } = await supabase.from("contact_entries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    load();
  };

  const save = async () => {
    if (!adding?.value.trim()) return toast.error("Enter a value");
    const preset = PRESETS.find((p) => p.key === adding.presetKey) ?? PRESETS[0];
    const cleaned = adding.value.trim();
    const href =
      preset.key === "whatsapp"
        ? `${preset.hrefPrefix}${cleaned.replace(/[^\d]/g, "")}`
        : preset.key === "website"
        ? (cleaned.startsWith("http") ? cleaned : `${preset.hrefPrefix}${cleaned}`)
        : `${preset.hrefPrefix}${cleaned}`;
    const { error } = await supabase.from("contact_entries").insert({
      label: preset.label,
      value: cleaned,
      href,
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setAdding(null);
    load();
  };

  const iconFor = (label: string) =>
    PRESETS.find((p) => p.label.toLowerCase() === label.toLowerCase())?.Icon ?? Globe;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Contact links shown on your homepage & contact page.</p>
        <button
          onClick={() => setAdding({ presetKey: "email", value: "" })}
          className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover-lift"
        >
          <Plus size={14} /> Add contact
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((e) => {
          const Icon = iconFor(e.label);
          return (
            <li key={e.id} className="glass rounded-xl p-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{e.label}</p>
                <p className="text-xs text-muted-foreground truncate">{e.value}</p>
              </div>
              <button onClick={() => remove(e.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10" aria-label="Remove">
                <Trash2 size={14} />
              </button>
            </li>
          );
        })}
        {items.length === 0 && <li className="text-sm text-muted-foreground">No contacts yet.</li>}
      </ul>

      {adding && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card border border-foreground/10 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Add contact</h3>
              <button onClick={() => setAdding(null)} className="p-1.5 rounded-lg hover:bg-foreground/10"><X size={16} /></button>
            </div>

            <Field label="Type">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PRESETS.map(({ key, label, Icon }) => {
                  const active = adding.presetKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setAdding({ ...adding, presetKey: key })}
                      className={`flex flex-col items-center gap-1 rounded-xl p-2 border transition-all ${active ? "border-primary bg-primary/10" : "border-foreground/10 hover:border-foreground/30"}`}
                    >
                      <Icon size={18} className={active ? "text-primary" : ""} />
                      <span className="text-[10px]">{label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="mt-4">
              <Field label="Value">
                <input
                  className={inputCls}
                  value={adding.value}
                  onChange={(e) => setAdding({ ...adding, value: e.target.value })}
                  placeholder={PRESETS.find((p) => p.key === adding.presetKey)?.placeholder}
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
