import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/format";

export function Carousel({
  children,
  label,
  autoplay = false,
}: {
  children: ReactNode;
  label: string;
  autoplay?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ active: false, startX: 0, scroll: 0, moved: false });

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    const slides = [...el.children] as HTMLElement[];
    if (!slides.length) return;
    const width = slides[0].getBoundingClientRect().width;
    const visible = Math.max(1, Math.round(el.clientWidth / (width + 16)));
    setPages(Math.max(1, slides.length - visible + 1));
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, index) => {
      const dist = Math.abs(slide.offsetLeft - el.scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });
    setPage(Math.min(best, Math.max(0, slides.length - visible)));
  };

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  const go = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    const slides = [...el.children] as HTMLElement[];
    const next = (index + slides.length) % slides.length;
    el.scrollTo({ left: slides[next].offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    if (!autoplay || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => go(page + 1), 5200);
    return () => window.clearInterval(id);
  }, [autoplay, paused, page]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={scroller}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        aria-label={label}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") return;
          const el = scroller.current;
          if (!el) return;
          drag.current = { active: true, startX: event.clientX, scroll: el.scrollLeft, moved: false };
          el.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const el = scroller.current;
          if (!drag.current.active || !el) return;
          const delta = event.clientX - drag.current.startX;
          if (Math.abs(delta) > 6) drag.current.moved = true;
          el.scrollLeft = drag.current.scroll - delta;
        }}
        onPointerUp={() => {
          drag.current.active = false;
        }}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {children}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2" role="tablist" aria-label={`${label} pages`}>
          {Array.from({ length: pages }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === page}
              onClick={() => go(index)}
              className={cn("h-2.5 rounded-full transition-all", index === page ? "w-6 bg-primary" : "w-2.5 bg-line")}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-lg text-primary hover:border-primary" onClick={() => go(page - 1)} aria-label={`Previous ${label}`}>
            ‹
          </button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-lg text-primary hover:border-primary" onClick={() => go(page + 1)} aria-label={`Next ${label}`}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
