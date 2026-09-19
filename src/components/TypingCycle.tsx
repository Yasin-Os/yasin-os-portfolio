import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Phrase = { text: string; dir?: "rtl" | "ltr"; lang?: string; className?: string };

/**
 * Typewriter that cycles through phrases:
 *   types in → holds → deletes → next phrase.
 */
export function TypingCycle({
  phrases,
  typingSpeed = 55,
  deletingSpeed = 25,
  holdMs = 2200,
}: {
  phrases: Phrase[];
  typingSpeed?: number;
  deletingSpeed?: number;
  holdMs?: number;
}) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const current = phrases[idx]?.text ?? "";
    let t: ReturnType<typeof setTimeout>;

    // Reduced motion: skip typing/deleting, just cycle full phrases on a longer hold.
    if (reduced) {
      if (text !== current) {
        setText(current);
        return;
      }
      t = setTimeout(() => setIdx((i) => (i + 1) % phrases.length), Math.max(holdMs, 3500));
      return () => clearTimeout(t);
    }

    if (phase === "typing") {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
      } else {
        t = setTimeout(() => setPhase("holding"), 50);
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("deleting"), holdMs);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed);
      } else {
        setIdx((i) => (i + 1) % phrases.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, idx, phrases, typingSpeed, deletingSpeed, holdMs, reduced]);

  const current = phrases[idx];

  return (
    <p
      dir={current?.dir}
      lang={current?.lang}
      className={`min-h-[2.5em] text-lg sm:text-xl text-foreground/80 leading-relaxed ${current?.className ?? ""}`}
    >
      <span>{text}</span>
      {!reduced && (
        <span className="inline-block w-[2px] h-[1em] align-middle bg-primary ml-1 animate-pulse" />
      )}
    </p>
  );
}
