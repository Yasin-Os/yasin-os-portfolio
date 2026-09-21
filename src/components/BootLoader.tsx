import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ARABIC = "السلام عليكم";
const BANGLA = "আমার ক্যানভাসে\nআপনাকে স্বাগতম";

const GREEN = "#047857";
const PINK = "#c2185b";

function useTyping(text: string, active: boolean, speed = 90) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) { setOut(""); return; }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return out;
}

export function BootLoader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<0 | 1>(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  const arabicTyped = useTyping(ARABIC, phase === 0, 100);
  const banglaTyped = useTyping(BANGLA, phase === 1, 60);

  useEffect(() => {
    const p1 = ARABIC.length * 100 + 600;
    const p2 = BANGLA.length * 60 + 800;
    const t1 = setTimeout(() => setPhase(1), p1);
    const t2 = setTimeout(() => setLeaving(true), p1 + p2);
    const t3 = setTimeout(() => { setDone(true); onDone(); }, p1 + p2 + 700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  if (done) return null;

  const color = phase === 0 ? GREEN : PINK;

  return (
    <div aria-hidden className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-700 ${leaving ? "opacity-0" : "opacity-100"}`}>
      <div className="pointer-events-none absolute inset-0 transition-colors duration-700" style={{ background: `radial-gradient(circle at 50% 50%, ${color}26 0%, transparent 55%)` }} />
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="boot-ring" style={{ borderColor: `${color}55` }} />
          <span className="boot-ring boot-ring-2" style={{ borderColor: `${color}33` }} />
          <span className="boot-ring boot-ring-3" style={{ borderColor: `${color}22` }} />
        </div>
      )}
      <div className="relative w-full px-6 flex flex-col items-center justify-center">
        {phase === 0 ? (
          <p dir="rtl" lang="ar" className="boot-text text-center font-serif text-4xl sm:text-6xl tracking-wide drop-shadow-[0_0_24px_rgba(4,120,87,0.45)]" style={{ color: GREEN }}>
            {arabicTyped}<span className="inline-block w-[3px] h-[1em] align-middle ml-1 boot-caret" style={{ backgroundColor: GREEN }} />
          </p>
        ) : (
          <p lang="bn" className="boot-text text-center font-serif text-3xl sm:text-5xl tracking-wide drop-shadow-[0_0_24px_rgba(194,24,91,0.45)] whitespace-pre-line leading-[1.4]" style={{ color: PINK }}>
            {banglaTyped}<span className="inline-block w-[3px] h-[1em] align-middle ml-1 boot-caret" style={{ backgroundColor: PINK }} />
          </p>
        )}
      </div>
      <style>{`
        .boot-text { animation: boot-fade 600ms ease-out both; }
        .boot-caret { animation: boot-blink 0.9s steps(2) infinite; }
        @keyframes boot-fade { from { opacity: 0; transform: translateY(8px) scale(0.98); filter: blur(4px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
        @keyframes boot-blink { 50% { opacity: 0; } }
        .boot-ring { position: absolute; width: 260px; height: 260px; border-radius: 9999px; border: 1.5px solid; opacity: 0; animation: boot-pulse 2.6s ease-out infinite; }
        .boot-ring-2 { width: 420px; height: 420px; animation-delay: 0.6s; }
        .boot-ring-3 { width: 580px; height: 580px; animation-delay: 1.2s; }
        @keyframes boot-pulse { 0% { transform: scale(0.6); opacity: 0.9; } 100% { transform: scale(1.15); opacity: 0; } }
      `}</style>
    </div>
  );
}
