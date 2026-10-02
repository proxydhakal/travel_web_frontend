import { useEffect, useRef } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useLockBody } from "../hooks/useLockBody";
import { IconClose } from "./Icons";

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: Array<{ src: string; alt: string; title?: string }>;
  index: number;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLockBody(true);
  useFocusTrap(true, ref);
  const current = images[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (event.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndex]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" ref={ref}>
      <button type="button" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink" onClick={onClose} aria-label="Close image viewer">
        <IconClose className="h-5 w-5" />
      </button>
      <button type="button" className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl text-primary sm:left-6" onClick={() => onIndex((index - 1 + images.length) % images.length)} aria-label="Previous image">
        ‹
      </button>
      <figure className="max-w-5xl">
        <img src={current.src} alt={current.alt} className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain" />
        <figcaption className="mt-3 text-center text-sm text-white">
          {current.title && <span className="font-medium">{current.title}</span>}
          <span className="ml-2 text-white/70">
            {index + 1} / {images.length}
          </span>
        </figcaption>
      </figure>
      <button type="button" className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl text-primary sm:right-6" onClick={() => onIndex((index + 1) % images.length)} aria-label="Next image">
        ›
      </button>
    </div>
  );
}
