import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Shield, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

type NavLink =
  | { kind: "section"; label: string; hash: string }
  | { kind: "route"; label: string; to: "/about" | "/contact" };

const links: NavLink[] = [
  { kind: "section", label: "Home", hash: "top" },
  { kind: "section", label: "Who Am I", hash: "who-am-i" },
  { kind: "section", label: "My Work", hash: "my-work" },
  { kind: "route", label: "About", to: "/about" },
  { kind: "route", label: "Contact", to: "/contact" },
];

export function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { accent, mode, toggleMode } = useTheme();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <nav className="mx-auto max-w-6xl px-4">
        <div className={`glass rounded-2xl px-4 py-3 flex items-center justify-between shadow-[var(--shadow-soft)] transition-all ${scrolled ? "bg-background/70 backdrop-blur-xl" : ""}`}>
          <Link to="/" className="flex items-center group">
            <span
              className="font-serif text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent transition-all"
              style={{
                backgroundImage: `linear-gradient(135deg, hsl(${accent.h} ${accent.s}% ${accent.l}%), hsl(${(accent.h + 40) % 360} ${accent.s}% ${Math.min(accent.l + 12, 80)}%))`,
              }}
            >
              Yasin's Canvas
            </span>
          </Link>

          <div className="flex items-center gap-2" ref={menuRef}>
            <button
              onClick={toggleMode}
              className="btn-anim w-9 h-9 rounded-full glass flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="btn-anim w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                aria-label="Menu"
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl p-2 animate-scale-in z-50 shadow-lg bg-background/95 backdrop-blur-xl border border-foreground/10">
                  <ul className="flex flex-col">
                    {links.map((l) => {
                      const cls = "block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-foreground/5";
                      if (l.kind === "section") {
                        return (
                          <li key={l.hash}>
                            <button
                              onClick={() => {
                                setMenuOpen(false);
                                const scrollToHash = () => {
                                  if (l.hash === "top") window.scrollTo({ top: 0, behavior: "smooth" });
                                  else document.getElementById(l.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                };
                                if (pathname !== "/") {
                                  navigate({ to: "/" });
                                  setTimeout(scrollToHash, 80);
                                } else scrollToHash();
                              }}
                              className={`btn-anim w-full text-left ${cls}`}
                            >
                              {l.label}
                            </button>
                          </li>
                        );
                      }
                      const active = pathname === l.to;
                      return (
                        <li key={l.to}>
                          <Link to={l.to} className={`${cls} ${active ? "bg-primary text-primary-foreground" : ""}`}>
                            {l.label}
                          </Link>
                        </li>
                      );
                    })}
                    <li className="my-1 border-t border-foreground/10" />
                    <li>
                      <Link to="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-foreground/5">
                        <Shield size={14} />
                        Admin Panel
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
