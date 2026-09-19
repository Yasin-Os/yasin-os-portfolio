import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, User, Briefcase, Images, AtSign, Share2, Palette, UserCog, Send } from "lucide-react";
import { ProfileSection } from "@/components/admin/ProfileSection";
import { WorkSection } from "@/components/admin/WorkSection";
import { GallerySection } from "@/components/admin/GallerySection";
import { ContactSection } from "@/components/admin/ContactSection";
import { SocialsSection } from "@/components/admin/SocialsSection";
import { AppearanceSection } from "@/components/admin/AppearanceSection";
import { AccountSection } from "@/components/admin/AccountSection";
import { ShareSection } from "@/components/admin/ShareSection";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Yasin Adnan" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "profile" | "work" | "gallery" | "contact" | "socials" | "share" | "appearance" | "account";

const TABS: { key: Tab; label: string; Icon: typeof User }[] = [
  { key: "profile", label: "Profile", Icon: User },
  { key: "work", label: "My Work", Icon: Briefcase },
  { key: "gallery", label: "Visual Journey", Icon: Images },
  { key: "contact", label: "Get In Touch", Icon: AtSign },
  { key: "socials", label: "Socials", Icon: Share2 },
  { key: "share", label: "Share / OG", Icon: Send },
  { key: "appearance", label: "Appearance", Icon: Palette },
  { key: "account", label: "Account", Icon: UserCog },
];

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have admin access.</p>
          <button
            onClick={() => signOut().then(() => navigate({ to: "/login" }))}
            className="mt-4 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <header className="flex items-center justify-between mb-6">
          <Link to="/" className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Back to site
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
        </header>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground mt-1 text-sm">Everything visitors see lives here.</p>

        {/* Mobile-friendly horizontal scroll tabs */}
        <div className="mt-6 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-1">
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  tab === key
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "glass hover:text-primary"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 glass rounded-3xl p-5 sm:p-7 animate-fade-up">
          {tab === "profile" && <ProfileSection />}
          {tab === "work" && <WorkSection />}
          {tab === "gallery" && <GallerySection />}
          {tab === "contact" && <ContactSection />}
          {tab === "socials" && <SocialsSection />}
          {tab === "share" && <ShareSection />}
          {tab === "appearance" && <AppearanceSection />}
          {tab === "account" && <AccountSection />}
        </div>
      </div>
    </div>
  );
}
