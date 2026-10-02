import type { Activity } from "../types";

export const activities: Activity[] = [
  {
    slug: "trekking",
    name: "Trekking",
    image: "/images/hike.jpg",
    summary: "Teahouse trails from Poon Hill to Everest Base Camp.",
    description: "Multi-day walks with a local guide, lodges, and a pace built around altitude.",
  },
  {
    slug: "hiking",
    name: "Hiking",
    image: "/images/trek2.jpg",
    summary: "Shorter days and viewpoint walks that still feel wild.",
    description: "Day hikes and short treks for travelers who want the mountains without a three-week commitment.",
  },
  {
    slug: "rafting",
    name: "Rafting",
    image: "/images/raft.jpg",
    summary: "Whitewater on the Trishuli, close to Kathmandu.",
    description: "Guided rafting with camp beside the river and a safety crew on the water.",
  },
  {
    slug: "safari",
    name: "Safari",
    image: "/images/elephant.jpg",
    summary: "Chitwan’s grasslands, rhinos, and river forest.",
    description: "Jeep safaris and naturalist walks in the lowland national park.",
  },
  {
    slug: "mountain-flight",
    name: "Mountain Flight",
    image: "/images/flight.jpg",
    summary: "A dawn flight along the Himalayan skyline.",
    description: "See Everest from the air when trekking is not the plan, or before you start.",
  },
  {
    slug: "camping",
    name: "Camping",
    image: "/images/camp.jpg",
    summary: "Nights under canvas on ridges and remote approaches.",
    description: "Used on Mardi’s higher camps, climbing peaks, and private routes such as Dolpo.",
  },
  {
    slug: "cultural-tours",
    name: "Cultural Tours",
    image: "/images/kathmandu.jpg",
    summary: "Stupas, dzongs, and living cities.",
    description: "Kathmandu, Pokhara, Bhutan, and pilgrimage journeys led by local guides.",
  },
  {
    slug: "paragliding",
    name: "Paragliding",
    image: "/images/alps.jpg",
    summary: "Tandem flights above Pokhara in the clear season.",
    description: "We arrange licensed tandem pilots in Pokhara on request. It is a day activity, not a set group departure.",
  },
  {
    slug: "cycling",
    name: "Cycling",
    image: "/images/cycle.jpg",
    summary: "Valley roads, support van, and a climb to a viewpoint.",
    description: "Short cycling journeys around Kathmandu with a leader who knows the quiet lanes.",
  },
  {
    slug: "photography",
    name: "Photography",
    image: "/images/camera.jpg",
    summary: "Time built in for dawn light, monasteries, and trails.",
    description: "Several treks leave space for photographers. Tell us if you want longer stops and earlier starts.",
  },
  {
    slug: "peak-climbing",
    name: "Peak Climbing",
    image: "/images/para2.jpg",
    summary: "Snow peaks such as Mera, with a climbing guide.",
    description: "Non-technical 6,000 m summits for trekkers ready for crampons and a long summit day.",
  },
  {
    slug: "helicopter",
    name: "Helicopter Tours",
    image: "/images/ebc.jpg",
    summary: "Charters to the Khumbu when a scenic flight is not enough.",
    description: "Private helicopter trips, including Everest views and returns from Lukla, are quoted per group. Ask the desk for the current charter rate.",
  },
];

export function getActivity(slug: string | undefined) {
  return activities.find((item) => item.slug === slug);
}
