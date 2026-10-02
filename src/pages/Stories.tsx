import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Media } from "../components/Media";
import NotFound from "./NotFound";
import { useContent } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Stories() {
  const { stories } = useContent();
  usePageMeta("Travel stories", "Notes from the Kathmandu desk on choosing a trek, packing, and seasons.");
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Stories" }]} />
      <section className="container-page py-10">
        <p className="eyebrow">From the desk</p>
        <h1 className="display-title mt-1">Travel stories and news</h1>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {stories.map((story) => (
            <article key={story.slug}>
              <Link to={`/stories/${story.slug}`} className="block overflow-hidden rounded-2xl">
                <Media src={story.image} alt="" className="h-52" />
              </Link>
              <p className="mt-3 text-xs text-muted">{story.date}</p>
              <h2 className="mt-1 text-xl font-bold">
                <Link to={`/stories/${story.slug}`} className="hover:text-primary">
                  {story.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{story.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function StoryDetails() {
  const { slug } = useParams();
  const { getStory } = useContent();
  const story = getStory(slug);
  usePageMeta(story ? story.title : "Story not found", story ? story.excerpt : "This story is not available.");
  if (!story) return <NotFound />;
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Stories", to: "/stories" }, { label: story.title }]} />
      <article className="container-page max-w-3xl py-10">
        <p className="text-xs text-muted">
          {story.date} · {story.author}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight">{story.title}</h1>
        <Media src={story.image} alt="" className="mt-6 h-72 rounded-2xl sm:h-96" priority />
        <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
          {story.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </article>
    </>
  );
}
