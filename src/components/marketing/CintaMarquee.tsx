"use client";

interface CintaMarqueeProps {
  items: string[];
  /** 1 = hacia la izquierda, -1 = hacia la derecha */
  direction?: 1 | -1;
}

// Cinta editorial acelerada por GPU (CSS puro sin loops JS en cada frame de scroll).
export default function CintaMarquee({
  items,
  direction = 1,
}: CintaMarqueeProps) {
  const row = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-dorado/20 bg-[#F2F5FA] py-5 lg:py-7 select-none"
      aria-hidden="true"
    >
      <div
        className={
          direction === 1 ? "marquee-track" : "marquee-track-reverse"
        }
      >
        {row.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center">
            <span
              className="font-display font-semibold uppercase leading-none tracking-tight whitespace-nowrap"
              style={{
                fontSize: "clamp(2rem, 5.2vw, 4.4rem)",
                color: i % 2 ? "transparent" : "#15214A",
                WebkitTextStroke:
                  i % 2 ? "1.2px rgba(164,124,27,0.75)" : "0px",
              }}
            >
              {t}
            </span>
            <span className="mx-6 lg:mx-9 text-[#C9A84C] text-lg lg:text-xl">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
