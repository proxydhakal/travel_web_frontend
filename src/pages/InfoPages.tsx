import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useContent, type Company } from "../content/ContentContext";
import { usePageMeta } from "../hooks/usePageMeta";

type Block = { heading: string; paragraphs: string[] };

function pagesFor(company: Company): Record<string, { title: string; description: string; blocks: Block[] }> {
  return {
  faq: {
    title: "Frequently asked questions",
    description: "Practical answers about permits, fitness, flights, and how booking works.",
    blocks: [
      {
        heading: "Do I need a guide?",
        paragraphs: [
          "On restricted routes such as Manaslu, Upper Mustang, and Kanchenjunga, a licensed guide is required. On classic teahouse treks we still send a guide because altitude, lodging, and weather decisions are easier with someone who knows the valley.",
        ],
      },
      {
        heading: "How fit should I be?",
        paragraphs: [
          "You should be comfortable walking for several hours on uneven ground. High routes add altitude, which fitness alone does not solve. We will say if a plan is too fast for the days you have.",
        ],
      },
      {
        heading: "What about Lukla flights?",
        paragraphs: ["They cancel in cloud and wind. Keep a spare day in Kathmandu on either side of an Everest trek. We do not compress acclimatization days to catch a plane."],
      },
      {
        heading: "Is travel insurance required?",
        paragraphs: ["Yes for trekking and climbing. The policy should cover trekking to your maximum altitude and helicopter evacuation. We ask for the details before departure."],
      },
    ],
  },
  terms: {
    title: "Terms",
    description: "The terms that apply when you book a trip with Enlighten Himalays.",
    blocks: [
      {
        heading: "Agreement",
        paragraphs: [
          `A booking is confirmed when we send a written confirmation and the deposit is received by ${company.name}. The itinerary, inclusions, and price in that confirmation are the ones that apply.`,
        ],
      },
      {
        heading: "Changes on the trail",
        paragraphs: [
          "Weather, flights, and trail conditions can force a change. We will propose the safest alternative and explain any cost difference before you decide. Safety outranks the original schedule.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: ["You are responsible for a valid passport, visas, insurance, and an honest description of your health and experience. Tell us about conditions that affect altitude or walking."],
      },
    ],
  },
  privacy: {
    title: "Privacy policy",
    description: "How Enlighten Himalays handles the details you send when planning a trip.",
    blocks: [
      {
        heading: "What we collect",
        paragraphs: [
          "When you enquire or book, we use your name, contact details, travel dates, and any notes you share about health or preferences. Newsletter signups on this site are stored in your browser until a mailing service is connected.",
        ],
      },
      {
        heading: "How it is used",
        paragraphs: ["Details are used to plan and operate your trip, to reach you about changes, and to meet permit requirements. We do not sell traveler lists."],
      },
      {
        heading: "Contact",
        paragraphs: [`Questions about your information can be sent to ${company.email}.`],
      },
    ],
  },
  booking: {
    title: "Booking policy",
    description: "Deposits, balances, and cancellations for Enlighten Himalays trips.",
    blocks: [
      {
        heading: "Deposit and balance",
        paragraphs: [
          "A deposit holds the departure and starts permit paperwork. The balance is due before you travel, on the date written in your confirmation. Peak season seats, Bhutan fees, and Tibet permits may require an earlier balance.",
        ],
      },
      {
        heading: "Cancellation",
        paragraphs: [
          "Cancel in writing. Refunds depend on how close the trip is and which costs are already paid to airlines, lodges, or permit offices. Those third-party costs are often non-refundable. Travel insurance is the right protection for illness and sudden changes.",
        ],
      },
      {
        heading: "Group discounts",
        paragraphs: ["Prices on this site are per person. Larger parties are repriced before you confirm, not adjusted after the trip has started."],
      },
    ],
  },
  careers: {
    title: "Careers",
    description: "Work with a Kathmandu trekking and travel team.",
    blocks: [
      {
        heading: "Who we look for",
        paragraphs: [
          "Licensed trekking guides, operations staff in Kathmandu, and people who can look after guests calmly when a flight moves. Experience on the trail matters more than a polished application.",
        ],
      },
      {
        heading: "How to write",
        paragraphs: [`Email ${company.email} with the subject “Careers”, a short note on where you have worked, and the role you want. We reply when there is a fit.`],
      },
    ],
  },
  sitemap: {
    title: "Site map",
    description: "Every main page on the Enlighten Himalays website.",
    blocks: [],
  },
  };
}

const mapLinks = [
  ["Home", "/"],
  ["Destinations", "/destinations"],
  ["Packages", "/packages"],
  ["Activities", "/activities"],
  ["Gallery", "/gallery"],
  ["Stories", "/stories"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["FAQ", "/faq"],
  ["Terms", "/terms"],
  ["Privacy", "/privacy"],
  ["Booking policy", "/booking-policy"],
  ["Careers", "/careers"],
];

export default function InfoPage({ pageKey }: { pageKey: string }) {
  const { company, legalDocuments } = useContent();
  const slug = pageKey === "booking" ? "booking-policy" : pageKey;
  const legal = legalDocuments.find((item) => item.slug === slug);
  const page = pagesFor(company)[pageKey];
  usePageMeta(legal?.title || page.title, legal?.summary || page.description);
  if (legal) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: legal.title }]} />
        <article className="container-page max-w-3xl py-10">
          <h1 className="text-4xl font-extrabold tracking-tight">{legal.title}</h1>
          <div className="mt-8 space-y-4 text-sm leading-7 text-muted" dangerouslySetInnerHTML={{ __html: legal.body }} />
        </article>
      </>
    );
  }
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: page.title }]} />
      <article className="container-page max-w-3xl py-10">
        <h1 className="text-4xl font-extrabold tracking-tight">{page.title}</h1>
        <div className="mt-8 space-y-8">
          {page.blocks.map((block) => (
            <section key={block.heading}>
              <h2 className="text-xl font-bold">{block.heading}</h2>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-3 text-sm leading-7 text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
          {pageKey === "sitemap" && (
            <ul className="grid gap-2 sm:grid-cols-2">
              {mapLinks.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="font-semibold text-primary hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </>
  );
}
