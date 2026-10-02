import { useMemo, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Lightbox } from "../components/Lightbox";
import { useContent } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { cn } from "../utils/format";

export default function Gallery() {
  const { galleryCategories, galleryItems } = useContent();
  usePageMeta("Gallery", "Photographs from Nepal treks, Kathmandu, wildlife, and the high country.");
  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState<number | null>(null);
  const visible = useMemo(
    () => galleryItems.filter((item) => category === "All" || item.category === category),
    [category, galleryItems],
  );

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Gallery" }]} />
      <section className="container-page py-10">
        <p className="eyebrow">From the trail</p>
        <h1 className="display-title mt-1">Gallery</h1>
        <div className="mt-6 flex gap-2 overflow-auto pb-2" role="tablist" aria-label="Gallery categories">
          {galleryCategories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold", category === item ? "bg-primary text-white" : "bg-surface text-ink")}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {visible.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl"
              onClick={() => setIndex(itemIndex)}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className={cn("w-full object-cover transition duration-500 group-hover:scale-105", item.tall ? "h-96" : "h-64")}
              />
              <span className="mt-2 block text-left text-sm font-semibold">{item.title}</span>
            </button>
          ))}
        </div>
      </section>
      {index !== null && (
        <Lightbox
          images={visible.map((item) => ({ src: item.src, alt: item.alt, title: item.title }))}
          index={index}
          onClose={() => setIndex(null)}
          onIndex={setIndex}
        />
      )}
    </>
  );
}
