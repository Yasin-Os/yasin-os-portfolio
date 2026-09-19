import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Yasin Adnan" },
      { name: "description", content: "Get in touch — contact info rendered from a JSON object." },
      { property: "og:title", content: "Contact — Yasin Adnan" },
      { property: "og:description", content: "Get in touch — contact info rendered from a JSON object." },
    ],
  }),
  component: Contact,
});

type Entry = { id: string; label: string; value: string; href: string | null };

function Contact() {
  const [entries, setEntries] = useState<Entry[]>([]);
  useEffect(() => {
    supabase
      .from("contact_entries")
      .select("id, label, value, href")
      .order("sort_order")
      .then(({ data }) => setEntries(data ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">Let's talk</h1>
        <p className="mt-2 text-muted-foreground max-w-prose">
          Reach me through any of the channels below.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="mac-window animate-scale-in">
          <div className="mac-window-bar">
            <span className="mac-dot red" />
            <span className="mac-dot yellow" />
            <span className="mac-dot green" />
            <span className="ml-3 text-xs text-white/60">contact.json</span>
          </div>
          <pre className="px-5 py-5 text-sm leading-relaxed overflow-x-auto">
            <code>
              <div><span className="json-bracket">{"{"}</span></div>
              {entries.length === 0 && (
                <div className="pl-4 text-white/50">// add entries from the admin panel</div>
              )}
              {entries.map((e, i) => (
                <div key={e.id} className="pl-4">
                  <span className="json-key">"{e.label}"</span>
                  <span className="json-punc">: </span>
                  <span className="json-string">"{e.value}"</span>
                  {i < entries.length - 1 && <span className="json-punc">,</span>}
                </div>
              ))}
              <div><span className="json-bracket">{"}"}</span></div>
            </code>
          </pre>
        </div>

        <div className="space-y-4 animate-fade-up">
          {entries.map((e) => (
            <a
              key={e.id}
              href={e.href || "#"}
              target={e.href ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="glass rounded-2xl p-4 flex items-center justify-between hover-lift block"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {e.label}
                </p>
                <p className="mt-0.5 text-base font-medium">{e.value}</p>
              </div>
              <span className="text-primary text-xl">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
