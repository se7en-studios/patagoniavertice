"use client";

import { useEffect, useState, useRef } from "react";

/**
 * useTypewriter - hook para efecto typewriter con loop
 * Inspirado en componentes de texto animado de 21st.dev (s/text)
 */
export function useTypewriter(
  texts: string[],
  {
    typeSpeed = 55,
    deleteSpeed = 30,
    pauseMs = 2200,
    startDelay = 800,
  }: {
    typeSpeed?: number;
    deleteSpeed?: number;
    pauseMs?: number;
    startDelay?: number;
  } = {}
) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        started.current = true;
        if (phase === "typing") {
          const target = texts[textIndex];
          if (charIndex < target.length) {
            setDisplayed(target.slice(0, charIndex + 1));
            setCharIndex((c) => c + 1);
          } else {
            setPhase("pausing");
          }
        } else if (phase === "pausing") {
          setPhase("deleting");
        } else {
          if (charIndex > 0) {
            setDisplayed((d) => d.slice(0, -1));
            setCharIndex((c) => c - 1);
          } else {
            setTextIndex((i) => (i + 1) % texts.length);
            setPhase("typing");
          }
        }
      },
      phase === "pausing"
        ? pauseMs
        : !started.current
          ? startDelay
          : phase === "typing"
            ? typeSpeed
            : deleteSpeed
    );
    return () => clearTimeout(timeout);
  }, [phase, charIndex, textIndex, texts, typeSpeed, deleteSpeed, pauseMs, startDelay]);

  return { displayed, isTyping: phase === "typing" };
}

/**
 * TypewriterText - componente de texto con cursor parpadeante
 */
export default function TypewriterText({
  texts,
  className = "",
  cursorClassName = "",
  typeSpeed,
  deleteSpeed,
  pauseMs,
  startDelay,
}: {
  texts: string[];
  className?: string;
  cursorClassName?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
  startDelay?: number;
}) {
  const { displayed } = useTypewriter(texts, {
    typeSpeed,
    deleteSpeed,
    pauseMs,
    startDelay,
  });

  return (
    <span className={className}>
      {displayed}
      <span
        className={`inline-block w-[2px] h-[1em] ml-[2px] align-middle animate-[blink_1s_step-end_infinite] ${cursorClassName}`}
        aria-hidden="true"
        style={{
          background: "currentColor",
          animation: "blink 1s step-end infinite",
        }}
      />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
