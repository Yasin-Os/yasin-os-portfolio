import { useEffect, useRef, useState } from "react";
import { Play, Pause, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/integrations/supabase/client";

/**
 * ControlsBar — Quran audio player + light/dark toggle.
 * Renders just below the navigation.
 */
export function ControlsBar() {
  const { mode, toggleMode } = useTheme();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLabel, setAudioLabel] = useState("Quran Recitation");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("audio_url, audio_label")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAudioUrl(data.audio_url);
          if (data.audio_label) setAudioLabel(data.audio_label);
        }
      });
  }, []);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 mt-3 mb-6">
      <div className="glass rounded-2xl px-3 py-2 flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={togglePlay}
          disabled={!audioUrl}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          <span className="hidden sm:inline">{audioLabel}</span>
          <span className="sm:hidden">Audio</span>
        </button>

        <button
          onClick={toggleMode}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-secondary text-secondary-foreground text-xs sm:text-sm hover-lift"
          aria-label="Toggle light or dark mode"
        >
          {mode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          <span className="capitalize">{mode === "dark" ? "Light" : "Dark"} mode</span>
        </button>
      </div>

      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} preload="none" />
      )}
    </div>
  );
}
