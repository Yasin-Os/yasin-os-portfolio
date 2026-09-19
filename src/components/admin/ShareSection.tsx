import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, ExternalLink, Facebook, Twitter, MessageCircle, Send, Eye, Globe, Save, Image as ImageIcon } from "lucide-react";
import { Field, inputCls } from "./ProfileSection";

const SITE_URL = "https://yasin-os.lovable.app";

export function ShareSection() {
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("profile")
      .select("id, og_title, og_description, og_image, avatar_url")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setId(data.id);
        setTitle(data.og_title ?? "");
        setDescription(data.og_description ?? "");
        setImage(data.og_image ?? "");
        setAvatar(data.avatar_url ?? null);
      });
  }, []);

  const save = async () => {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase
      .from("profile")
      .update({
        og_title: title || "Yasin Adnan — Portfolio",
        og_description: description || "Personal portfolio.",
        og_image: image || null,
      })
      .eq("id", id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("OG share info saved");
  };

  const copy = async (text: string, label = "Copied") => {
    try { await navigator.clipboard.writeText(text); toast.success(label); }
    catch { toast.error("Copy failed"); }
  };

  const previewImg = image || avatar || "";

  const shareLinks = [
    { Icon: Facebook, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}` },
    { Icon: Twitter, label: "Twitter / X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(title)}` },
    { Icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${SITE_URL}`)}` },
    { Icon: Send, label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(title)}` },
  ];

  return (
    <div className="space-y-6">
      <Field label="Your site URL">
        <div className="flex gap-2">
          <input className={inputCls} value={SITE_URL} readOnly />
          <button
            onClick={() => copy(SITE_URL, "Link copied")}
            className="btn-anim shrink-0 flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-3 text-xs font-medium"
          >
            <Copy size={14} /> Copy
          </button>
        </div>
      </Field>

      <div className="rounded-2xl border border-foreground/10 p-4 space-y-3 bg-background/40">
        <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ImageIcon size={12} /> Custom share preview (OG)
        </p>
        <Field label="OG title">
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Yasin Adnan — Portfolio" />
        </Field>
        <Field label="OG description">
          <textarea
            className={inputCls + " min-h-[72px]"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short tagline shown under the title in shared links."
          />
        </Field>
        <Field label="OG image URL (1200×630 recommended)">
          <input
            className={inputCls}
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://… (leave empty to use your profile photo)"
          />
        </Field>
        <button
          onClick={save}
          disabled={saving}
          className="btn-anim inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Save size={14} /> {saving ? "Saving…" : "Save OG info"}
        </button>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
          <Eye size={12} /> Preview
        </p>
        <div className="rounded-2xl overflow-hidden border border-foreground/10 bg-background/60">
          {previewImg && (
            <div className="aspect-[1.91/1] w-full bg-muted overflow-hidden">
              <img src={previewImg} alt="OG preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Globe size={10} /> yasin-os.lovable.app
            </p>
            <p className="text-sm font-semibold mt-0.5 line-clamp-2">{title || "Yasin Adnan — Portfolio"}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description || "Personal portfolio."}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Share to</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {shareLinks.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-anim flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium"
            >
              <Icon size={14} /> {label}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-foreground/10 p-4 space-y-3">
        <p className="text-xs text-muted-foreground">
          After saving, refresh the cache on the platforms below so the new preview shows up:
        </p>
        <div className="flex flex-wrap gap-2">
          <a href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(SITE_URL)}`} target="_blank" rel="noopener noreferrer" className="btn-anim inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-medium">
            <ExternalLink size={12} /> Facebook Debugger
          </a>
          <a href={`https://cards-dev.twitter.com/validator`} target="_blank" rel="noopener noreferrer" className="btn-anim inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-medium">
            <ExternalLink size={12} /> Twitter Validator
          </a>
          <a href={`https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(SITE_URL)}`} target="_blank" rel="noopener noreferrer" className="btn-anim inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-medium">
            <ExternalLink size={12} /> LinkedIn Inspector
          </a>
        </div>
      </div>
    </div>
  );
}
