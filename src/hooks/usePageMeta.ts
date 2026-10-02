import { useEffect } from "react";

function setNamed(name: string, content: string) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setProperty(property: string, content: string) {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function usePageMeta(title: string, description: string, extras?: { keywords?: string; image?: string; brand?: string; favicon?: string }) {
  useEffect(() => {
    const brand = extras?.brand || "Enlighten Himalays";
    document.title = title.includes(brand) ? title : `${title} | ${brand}`;
    setNamed("description", description);
    if (extras?.keywords) setNamed("keywords", extras.keywords);
    setProperty("og:title", document.title);
    setProperty("og:description", description);
    if (extras?.image) setProperty("og:image", extras.image);
    if (extras?.favicon) {
      const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (link) link.href = extras.favicon;
    }
  }, [title, description, extras?.keywords, extras?.image, extras?.brand, extras?.favicon]);
}
