import type { Story } from "../types";

export const stories: Story[] = [
  {
    slug: "choose-your-first-nepal-trek",
    title: "How to choose your first trek in Nepal",
    date: "March 12, 2026",
    author: "Niraj Lama",
    image: "/images/hike.jpg",
    excerpt: "Time, altitude, and how you feel on stairs matter more than the famous name on the map.",
    body: [
      "The trek people ask for first is usually Everest Base Camp. Sometimes that is the right answer. Often a shorter trail in the Annapurna foothills or Langtang will feel better, especially if you have less than two weeks or you have never slept above 3,000 meters.",
      "Start with three questions. How many full days can you walk, not including flights? Have you hiked for five or six hours with a light pack? Do you need to be back in Kathmandu on a fixed morning? If the third answer is yes, build a buffer. Lukla and Jomsom flights move.",
      "Poon Hill and Everest Panorama are honest first treks. Annapurna Base Camp is the next step. Everest Base Camp is wonderful when you can give it the acclimatization days it asks for. Tell us the dates and how you travel, and we will say clearly if the route is too fast.",
    ],
  },
  {
    slug: "what-to-pack-for-everest",
    title: "What to pack for Everest Base Camp",
    date: "January 28, 2026",
    author: "Enlighten Himalays",
    image: "/images/camp.jpg",
    excerpt: "A sleeping bag, broken-in boots, and layers you can actually walk in. Leave the extra pair of jeans.",
    body: [
      "The trail to base camp is a walk, not a climb, but the nights at Lobuche and Gorak Shep are well below freezing in season. A three-season sleeping bag rated around -10°C to -15°C is the item people are happiest they brought.",
      "Wear boots you have already walked in. Add a light insulating layer, a warmer belay jacket for camp, a sun hat, and gloves you can hold trekking poles with. Down pants are useful at high lodges and unnecessary on most walking days.",
      "Renting a sleeping bag and a down jacket in Kathmandu is normal and cheaper than flying with a poor one. We will tell you what is worth buying at home and what the Thamel shops do well. Porters carry the duffel. You walk with a daypack of water, a layer, and the camera.",
    ],
  },
  {
    slug: "best-season-khumbu",
    title: "The best season to walk in the Khumbu",
    date: "November 4, 2025",
    author: "Enlighten Himalays",
    image: "/images/alps.jpg",
    excerpt: "Autumn is clearest. Spring is softer and floral. Both need patience with the Lukla flight.",
    body: [
      "Late September through November is the classic window. The monsoon has left, the air is dry, and Everest is most likely to be clear at dawn. October lodges fill up. If you want that month, tell us early.",
      "March to May is the other good season. It is warmer on the lower trail, rhododendron flowers in the forest below Namche, and the high camps can be windier. Views are excellent, with a little more haze than in autumn.",
      "Winter treks are quiet and cold, and possible for experienced walkers. The monsoon is the season we rarely recommend for Everest, because the flight and the trail both suffer. Whichever month you choose, keep one spare day in Kathmandu. That single decision prevents more ruined trips than any piece of gear.",
    ],
  },
];

export function getStory(slug: string | undefined) {
  return stories.find((item) => item.slug === slug);
}
