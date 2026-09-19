import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Yasin Adnan" },
      { name: "description", content: "About me — rendered as a JSON object in a macOS-style code window." },
      { property: "og:title", content: "About — Yasin Adnan" },
      { property: "og:description", content: "About me — rendered as a JSON object in a macOS-style code window." },
    ],
  }),
  component: About,
});

type Profile = {
  name: string;
  rank: string;
  status: string;
  hobbies: string[];
  bio: string;
};

function About() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase
      .from("profile")
      .select("name, rank, status, hobbies, bio")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => data && setProfile(data));
  }, []);

  const p = profile ?? {
    name: "Yasin Adnan",
    rank: "Leader of Noobs",
    status: "404: Potential Not Found",
    hobbies: ["Coding", "Gaming", "Photography"],
    bio: "Builder of things on the web.",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">A bit about me</h1>
        <p className="mt-2 text-muted-foreground max-w-prose">{p.bio}</p>
      </header>

      <div className="mac-window animate-scale-in">
        <div className="mac-window-bar">
          <span className="mac-dot red" />
          <span className="mac-dot yellow" />
          <span className="mac-dot green" />
          <span className="ml-3 text-xs text-white/60">about.js</span>
        </div>
        <pre className="px-5 py-5 text-sm leading-relaxed overflow-x-auto">
          <code>
            <Line indent={0}><span className="json-punc">const</span>{" "}<span className="text-white">me</span>{" "}<span className="json-punc">=</span>{" "}<span className="json-bracket">{"{"}</span></Line>
            <Line indent={1}><Field k="name" v={`"${p.name}"`} /></Line>
            <Line indent={1}><Field k="rank" v={`"${p.rank}"`} /></Line>
            <Line indent={1}><Field k="status" v={`"${p.status}"`} /></Line>
            <Line indent={1}>
              <span className="json-key">hobbies</span>
              <span className="json-punc">: </span>
              <span className="json-bracket">[</span>
            </Line>
            {p.hobbies.map((h, i) => (
              <Line key={i} indent={2}>
                <span className="json-string">"{h}"</span>
                {i < p.hobbies.length - 1 && <span className="json-punc">,</span>}
              </Line>
            ))}
            <Line indent={1}><span className="json-bracket">]</span></Line>
            <Line indent={0}><span className="json-bracket">{"}"}</span><span className="json-punc">;</span></Line>
          </code>
        </pre>
      </div>
    </div>
  );
}

function Line({ indent, children }: { indent: number; children: React.ReactNode }) {
  return <div style={{ paddingLeft: `${indent * 1.25}rem` }}>{children}</div>;
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <>
      <span className="json-key">{k}</span>
      <span className="json-punc">: </span>
      <span className="json-string">{v}</span>
      <span className="json-punc">,</span>
    </>
  );
}
