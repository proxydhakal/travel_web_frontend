import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Media } from "../components/Media";
import { useContent } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";
import NotFound from "./NotFound";

export default function CmsPageView() {
  const { slug } = useParams();
  const { pages, company, seo } = useContent();
  const page = pages.find((item) => item.slug === slug);
  usePageMeta(page?.metaTitle || page?.title || "Page", page?.metaDescription || page?.excerpt || "", {
    keywords: page?.metaKeywords || seo.keywords,
    image: page?.cover || seo.ogImage,
    brand: company.short,
    favicon: seo.favicon,
  });
  if (!page) return <NotFound />;
  const group = page.group === "guide" ? "Travel guides" : "Company";
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: group }, { label: page.title }]} />
      <article className="container-page max-w-4xl py-10">
        {page.cover && <Media src={page.cover} alt="" className="h-72 rounded-3xl sm:h-[420px]" priority />}
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">{group}</p>
        <h1 className="mt-2 text-4xl font-bold text-primary">{page.title}</h1>
        {page.excerpt && <p className="mt-3 text-lg text-muted">{page.excerpt}</p>}
        <div className="mt-8 space-y-4 text-sm leading-7 text-muted" dangerouslySetInnerHTML={{ __html: page.body }} />
      </article>
    </>
  );
}
