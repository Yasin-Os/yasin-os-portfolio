import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * ThemeProvider — handles:
 *   - light/dark mode (user toggle, persists in localStorage)
 *   - global accent color (HSL) loaded from site_settings; the admin sets it
 *     in the admin panel and every visitor sees the same accent.
 */

export type Accent = { name: string; h: number; s: number; l: number };

export const ACCENTS: Accent[] = [
  { name: "Indigo", h: 244, s: 75, l: 60 },
  { name: "Ocean", h: 205, s: 80, l: 55 },
  { name: "Emerald", h: 158, s: 65, l: 45 },
  { name: "Sunset", h: 18, s: 85, l: 58 },
  { name: "Rose", h: 340, s: 75, l: 60 },
  { name: "Amber", h: 38, s: 90, l: 55 },
  { name: "Violet", h: 270, s: 75, l: 60 },
  { name: "Cyan", h: 190, s: 80, l: 50 },
];

type Mode = "light" | "dark";

type Ctx = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  accent: Accent;
  /** Refresh accent from DB (call after admin saves). */
  refreshAccent: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

const DEFAULT_ACCENT: Accent = ACCENTS[0];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");
  const [accent, setAccentState] = useState<Accent>(DEFAULT_ACCENT);

  // Load mode from localStorage (or system preference)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme-mode") as Mode | null;
    if (saved === "light" || saved === "dark") setModeState(saved);
    else setModeState(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  // Load global accent from DB
  const loadAccent = () => {
    supabase
      .from("site_settings")
      .select("accent_h, accent_s, accent_l")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAccentState({
            name: "Custom",
            h: data.accent_h ?? DEFAULT_ACCENT.h,
            s: data.accent_s ?? DEFAULT_ACCENT.s,
            l: data.accent_l ?? DEFAULT_ACCENT.l,
          });
        }
      });
  };
  useEffect(() => {
    loadAccent();
  }, []);

  // Apply mode to <html>
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  // Apply accent CSS vars
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--accent-h", String(accent.h));
    root.style.setProperty("--accent-s", `${accent.s}%`);
    root.style.setProperty("--accent-l", `${accent.l}%`);
  }, [accent]);

  const setMode = (m: Mode) => {
    setModeState(m);
    if (typeof window !== "undefined") localStorage.setItem("theme-mode", m);
  };
  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  const value = useMemo(
    () => ({ mode, setMode, toggleMode, accent, refreshAccent: loadAccent }),
    [mode, accent],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
