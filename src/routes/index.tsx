import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";
import { VisualJourney } from "@/components/VisualJourney";
import { GetInTouch } from "@/components/GetInTouch";
import { SocialLinks } from "@/components/SocialLinks";
import { SectionOrbs } from "@/components/SectionOrbs";
import { TypingCycle } from "@/components/TypingCycle";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Video, Palette, AudioLines, Code2, Smartphone, Sparkles, GraduationCap, BookOpen } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.png";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { data } = await supabase
      .from("profile")
      .select("og_title, og_description, og_image, avatar_url")
      .limit(1)
      .maybeSingle();
    const fallbackImg =
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dc22ae3c-5d56-4490-aa63-2b9e34fa8f3c/id-preview-f844324e--41c6e9a7-e19e-4b74-b3b8-6e604c679875.lovable.app-1778492174548.png";
    return {
      ogTitle: data?.og_title ?? "Yasin Adnan — Portfolio",
      ogDescription: data?.og_description ?? "Personal portfolio of Yasin Adnan.",
      ogImage: data?.og_image || data?.avatar_url || fallbackImg,
    };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.ogTitle ?? "Yasin Adnan — Portfolio";
    const d = loaderData?.ogDescription ?? "Personal portfolio of Yasin Adnan.";
    const img = loaderData?.ogImage;
    const url = "https://yasin-os.lovable.app/";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Yasin Adnan" },
        ...(img
          ? [
              { property: "og:image", content: img },
              { property: "og:image:secure_url", content: img },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:image:alt", content: t },
              { name: "twitter:image", content: img },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: t },
        { name: "twitter:description", content: d },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: Index,
});

type Profile = {
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  typing_arabic: string;
  typing_bangla: string;
  who_focus: string;
  who_personality: string;
  who_favourite_book: string;
  who_interests: string[];
};

function Index() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [contactHref, setContactHref] = useState<string | null>(null);
  useScrollReveal();

  useEffect(() => {
    supabase
      .from("profile")
      .select("name, title, bio, avatar_url, typing_arabic, typing_bangla, who_focus, who_personality, who_favourite_book, who_interests")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (data) setProfile(data as Profile); });
    supabase
      .from("contact_entries")
      .select("href")
      .order("sort_order")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (data?.href) setContactHref(data.href); });
  }, []);

  const name = profile?.name ?? "Yasin Adnan";
  const avatar = profile?.avatar_url || defaultAvatar;
  const badge = profile?.title?.trim() || "Tech Enthusiast";
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <div>
      {/* HERO */}
      <section className="section-frame section-tint-1 min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-8 mx-auto max-w-4xl">
        <SectionOrbs colors={["hsl(244 80% 65% / 0.28)", "hsl(280 75% 65% / 0.24)", "hsl(210 85% 65% / 0.22)"]} />
        <div className="relative animate-scale-in">
          <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
          <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden glow-ring animate-float">
            <img
              src={avatar}
              alt={name}
              width={640}
              height={640}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          <div dir="rtl" lang="ar" className="absolute top-3 -right-6 sm:-right-14 lg:-right-20 z-10 animate-fade-up">
            <div className="salam-bubble relative rounded-2xl rounded-bl-sm bg-gradient-to-br from-primary to-accent text-primary-foreground px-4 py-2 text-sm sm:text-base font-semibold shadow-[var(--shadow-glow)] rotate-[-2deg]">
              السلام عليكم
              <span className="absolute -left-1.5 bottom-3 w-3 h-3 rotate-45 bg-primary" />
            </div>
          </div>
        </div>

        <div className="mt-6 animate-fade-up">
          <span className="inline-block rounded-full border border-primary/40 px-5 py-1.5 text-xs sm:text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            {badge}
          </span>
        </div>

        <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight animate-fade-up">
          <span className="text-foreground">{firstName}{lastName && " "}</span>
          {lastName && <span className="text-primary">{lastName}</span>}
        </h1>


        <div className="mt-4 max-w-2xl w-full animate-fade-up">
          <TypingCycle
            phrases={[
              { text: profile?.typing_arabic ?? "اَللّٰهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا", dir: "rtl", lang: "ar", className: "font-medium" },
              { text: profile?.typing_bangla ?? "হে আল্লাহ! আমি আপনার কাছে উপকারী জ্ঞান, পবিত্র রিজিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।", lang: "bn" },
            ]}
          />
        </div>

        <div className="mt-6 w-full flex flex-col gap-3 animate-fade-up">
          <a
            href={contactHref || "/contact"}
            target={contactHref ? "_blank" : undefined}
            rel={contactHref ? "noopener noreferrer" : undefined}
            className="btn-anim block w-full text-center rounded-2xl bg-primary py-4 text-base sm:text-lg font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90"
          >
            Contact Me
          </a>
          <a
            href="#who-am-i"
            onClick={(e) => { e.preventDefault(); document.getElementById("who-am-i")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            className="btn-anim block w-full text-center rounded-2xl border border-primary/60 bg-transparent py-4 text-base sm:text-lg font-semibold text-foreground hover:bg-primary/10"
          >
            About Me
          </a>
        </div>
      </section>

      {/* WHO AM I */}
      <section id="who-am-i" className="section-frame section-tint-2 min-h-[88vh] flex flex-col justify-center reveal-on-scroll px-4 py-8 mx-auto max-w-4xl w-full">
        <SectionOrbs colors={["hsl(190 80% 60% / 0.24)", "hsl(170 75% 55% / 0.20)", "hsl(220 80% 65% / 0.20)"]} />
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="h-px w-12 bg-primary" />
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">Who Am I?</h2>
          <span className="h-px w-12 bg-primary" />
        </div>

        {profile?.bio?.trim() && (
          <p className="mx-auto max-w-2xl text-center text-sm sm:text-base text-muted-foreground mb-6 whitespace-pre-line">
            {profile.bio}
          </p>
        )}


        <div className="relative rounded-2xl overflow-hidden border border-foreground/10 bg-[#0f1424] shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </span>
            <span className="ml-2 text-xs font-mono text-slate-400">&gt;_ yasin_config.json</span>
          </div>

          <WhoAmICode profile={profile} />


          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        </div>
      </section>

      {/* MY WORK */}
      <MyWorkSection />

      {/* VISUAL JOURNEY */}
      <VisualJourneySection />

      {/* CONNECT WITH ME */}
      <section id="connect" className="section-frame section-tint-5 min-h-[70vh] flex flex-col justify-center reveal-on-scroll px-4 py-10 mx-auto max-w-4xl w-full">
        <SectionOrbs colors={["hsl(160 75% 55% / 0.24)", "hsl(140 70% 50% / 0.20)", "hsl(180 80% 60% / 0.20)"]} />
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="h-px w-10 bg-primary" />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Connect With Me</h2>
          <span className="h-px w-10 bg-primary" />
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">Find me on these platforms</p>
        <SocialLinks />
      </section>

      {/* GET IN TOUCH */}
      <section id="get-in-touch" className="section-frame section-tint-4 min-h-[60vh] flex items-center reveal-on-scroll px-4 py-10 mx-auto max-w-4xl w-full">
        <SectionOrbs colors={["hsl(38 90% 65% / 0.26)", "hsl(20 85% 65% / 0.20)", "hsl(50 90% 60% / 0.20)"]} />
        <div className="w-full">
          <GetInTouch />
        </div>
      </section>
    </div>
  );
}

const WORK_ITEMS = [
  { title: "Video Editing", category: "video", Icon: Video, accent: "from-rose-500/20 to-orange-500/20", iconColor: "text-rose-400" },
  { title: "Graphics Design", category: "graphic", Icon: Palette, accent: "from-fuchsia-500/20 to-purple-500/20", iconColor: "text-fuchsia-400" },
  { title: "Audio Editing", category: "audio", Icon: AudioLines, accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
  { title: "Web Develop", category: "website", Icon: Code2, accent: "from-sky-500/20 to-blue-500/20", iconColor: "text-sky-400" },
  { title: "App Develop", category: "app", Icon: Smartphone, accent: "from-indigo-500/20 to-violet-500/20", iconColor: "text-indigo-400" },
  { title: "AI", category: "ai", Icon: Sparkles, accent: "from-amber-500/20 to-yellow-500/20", iconColor: "text-amber-400" },
  { title: "Tutorial", category: "tutorial", Icon: GraduationCap, accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
  { title: "Islam", category: "islam", Icon: BookOpen, accent: "from-green-500/20 to-emerald-500/20", iconColor: "text-green-500" },
] as const;

function MyWorkSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true }));

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <section id="my-work" className="section-frame section-tint-3 min-h-[70vh] flex flex-col reveal-on-scroll px-4 py-10 mx-auto max-w-4xl w-full">
      <SectionOrbs colors={["hsl(330 80% 65% / 0.24)", "hsl(300 75% 65% / 0.20)", "hsl(350 80% 65% / 0.20)"]} />
      <div className="flex items-center justify-center gap-4 mt-2 mb-4">
        <span className="h-px w-10 bg-primary" />
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">My Work</h2>
        <span className="h-px w-10 bg-primary" />
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true }}
        plugins={[autoplay.current]}
        className="w-full max-w-sm sm:max-w-md mx-auto"
      >
        <CarouselContent>
          {WORK_ITEMS.map(({ title, category, Icon, accent, iconColor }) => (
            <CarouselItem key={title} className="basis-1/2 sm:basis-1/2">
              <Link
                to="/my-work"
                search={{ category }}
                className={`relative block rounded-2xl border border-foreground/10 bg-gradient-to-br ${accent} backdrop-blur p-5 shadow-[var(--shadow-soft)] flex flex-col items-center justify-center gap-3 aspect-square hover:border-primary/40 hover:scale-[1.03] transition-all`}
              >
                <div className={`rounded-full bg-background/60 p-3.5 ${iconColor}`}>
                  <Icon className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground text-center">{title}</h3>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-3 flex justify-center gap-1.5">
        {WORK_ITEMS.map((item, i) => (
          <button
            key={item.title}
            aria-label={`Go to ${item.title}`}
            onClick={() => api?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              selected === i ? "w-5 bg-primary" : "w-1.5 bg-primary/30 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function VisualJourneySection() {
  return (
    <section id="visual-journey" className="section-frame section-tint-3 min-h-[70vh] flex flex-col reveal-on-scroll px-4 py-10 mx-auto max-w-4xl w-full">
      <SectionOrbs colors={["hsl(280 75% 65% / 0.22)", "hsl(330 75% 65% / 0.20)", "hsl(250 80% 65% / 0.20)"]} />
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="h-px w-10 bg-accent" />
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Visual Journey</h2>
        <span className="h-px w-10 bg-accent" />
      </div>
      <div className="flex-1">
        <VisualJourney />
      </div>
    </section>
  );
}

function WhoAmICode({ profile }: { profile: Profile | null }) {
  const name = profile?.name ?? "Yasin Adnan";
  const focus = profile?.who_focus ?? "Learning coding & technology through AI";
  const personality = profile?.who_personality ?? "Calm learner, curious thinker, future-focused dreamer";
  const book = profile?.who_favourite_book ?? "Al-Qur'an";
  const interests = profile?.who_interests ?? ["Reading books", "Writing poetry", "Self-development"];

  // Build the full code as tokens so we can type characters one by one
  // while preserving syntax-highlight colors.
  type Tok = { t: string; c?: string };
  const tokens: Tok[] = [
    { t: "const", c: "#569cd6" }, { t: " " },
    { t: "yasin", c: "#9cdcfe" }, { t: " = {\n  " },
    { t: "name", c: "#7ee787" }, { t: ": " },
    { t: `"${name}"`, c: "#e5a663" }, { t: ",\n  " },
    { t: "focus", c: "#7ee787" }, { t: ": " },
    { t: `"${focus}"`, c: "#e5a663" }, { t: ",\n  " },
    { t: "personality", c: "#7ee787" }, { t: ": " },
    { t: `"${personality}"`, c: "#e5a663" }, { t: ",\n  " },
    { t: "favouriteBook", c: "#7ee787" }, { t: ": " },
    { t: `"${book}"`, c: "#e5a663" }, { t: ",\n  " },
    { t: "interests", c: "#c586c0" }, { t: ": [" },
  ];
  interests.forEach((it, idx) => {
    tokens.push({ t: "\n    " });
    tokens.push({ t: `"${it}"`, c: "#e5a663" });
    if (idx < interests.length - 1) tokens.push({ t: "," });
  });
  tokens.push({ t: "\n  ]\n};" });

  const totalLen = tokens.reduce((n, x) => n + x.t.length, 0);
  const [pos, setPos] = useState(0);
  useEffect(() => {
    setPos(0);
  }, [name, focus, personality, book, interests.join("|")]);
  useEffect(() => {
    if (pos >= totalLen) return;
    const t = setTimeout(() => setPos((p) => Math.min(p + 4, totalLen)), 40);
    return () => clearTimeout(t);
  }, [pos, totalLen]);

  // Render tokens up to current position
  const parts: React.ReactNode[] = [];
  let remaining = pos;
  for (let i = 0; i < tokens.length; i++) {
    if (remaining <= 0) break;
    const tk = tokens[i];
    const slice = tk.t.slice(0, remaining);
    parts.push(
      <span key={i} style={tk.c ? { color: tk.c } : undefined}>{slice}</span>
    );
    remaining -= slice.length;
  }

  return (
    <pre className="mx-auto px-5 py-8 text-sm sm:text-base leading-relaxed font-mono whitespace-pre-wrap break-words text-slate-300">
      {parts}
      <span className="inline-block w-[7px] h-[1em] align-middle bg-emerald-400/80 ml-1 animate-pulse" />
    </pre>
  );
}
