import { ButtonLink } from "../components/Button";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Media } from "../components/Media";
import { Reasons } from "../components/Reasons";
import { Testimonials } from "../components/Testimonials";
import { useContent } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";

const values = [
  { title: "Local knowledge", text: "Routes are chosen by people who have walked them, not copied from a catalog." },
  { title: "Clear money", text: "Permits, guides, and lodges are listed. Group discounts are explained before you pay." },
  { title: "Care on the trail", text: "Guides are licensed, porters are part of the plan, and the Kathmandu desk stays reachable." },
  { title: "A lighter footprint", text: "A share of earnings supports people who need it, and we prefer lodges and trails that can keep hosting." },
];

export default function About() {
  const { company, about, team } = useContent();
  const stats = [
    { value: `${Math.max(1, new Date().getFullYear() - Number(company.since))}+`, label: "Years guiding" },
    { value: company.travelers, label: "Travelers hosted" },
    { value: "100+", label: "Countries represented" },
    { value: company.reviews, label: "Guest notes" },
  ];
  usePageMeta(about.heading || "About us", about.paragraphs[0] || `${company.short} is a Kathmandu travel company led by ${company.owner}.`);
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Company", to: "/about" }, { label: "About us" }]} />
      <article>
        <div className="container-page py-8">
          <Media src={about.heroImage || "/images/ebc.jpg"} alt="A wide view of snow peaks under a bright sky" className="h-72 rounded-2xl sm:h-[460px]" priority />
          <h1 className="mt-8 text-4xl font-extrabold uppercase tracking-tight">{about.heading || "About us"}</h1>
          <div id="story" className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-muted">
            {(about.paragraphs.length ? about.paragraphs : [`${company.short} plans treks and tours from Kathmandu.`]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <section className="bg-primary py-12 text-white">
          <div className="container-page grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-tertiary sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page grid gap-6 py-14 md:grid-cols-3">
          <article className="rounded-2xl bg-sand p-6">
            <h2 className="text-xl font-bold">Mission</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{about.mission}</p>
          </article>
          <article className="rounded-2xl bg-sand p-6">
            <h2 className="text-xl font-bold">Vision</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{about.vision}</p>
          </article>
          <article className="rounded-2xl bg-sand p-6">
            <h2 className="text-xl font-bold">Promise</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{about.promise}</p>
          </article>
        </section>

        <section className="container-page pb-14">
          <h2 className="text-2xl font-extrabold uppercase">Values</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(about.values.length ? about.values : values).map((value) => (
              <article key={value.title} className="rounded-2xl border border-line p-5">
                <h3 className="font-bold">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{value.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-page pb-6">
          <h2 className="text-2xl font-extrabold uppercase">The desk</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(team.length ? team : [{ id: 0, name: company.owner, role: company.ownerRole, bio: "Owns the company and takes the planning calls.", image: "" }]).map((person) => (
              <article key={person.name} className="rounded-2xl bg-surface p-5">
                {person.image ? (
                  <Media src={person.image} alt="" className="h-14 w-14 rounded-full" />
                ) : (
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-white">{person.name.slice(0, 1)}</span>
                )}
                <h3 className="mt-4 font-bold">{person.name}</h3>
                <p className="text-sm font-medium text-secondary">{person.role}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{person.bio}</p>
              </article>
            ))}
          </div>
        </section>

        <Reasons />
        <Testimonials />
        <section className="container-page pb-16 text-center">
          <h2 className="text-3xl font-extrabold">Ready when you are</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted">Send dates, a rough route, and who is coming. We reply with a plan and a price that lists what is included.</p>
          <ButtonLink to="/contact" className="mt-6">
            Contact the team
          </ButtonLink>
        </section>
      </article>
    </>
  );
}
