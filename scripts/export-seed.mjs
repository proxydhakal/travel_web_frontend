import { writeFileSync } from "node:fs";
import { packages } from "../src/data/packages.ts";
import { destinations } from "../src/data/destinations.ts";
import { activities } from "../src/data/activities.ts";
import { testimonials } from "../src/data/testimonials.ts";
import { galleryItems, galleryCategories } from "../src/data/gallery.ts";
import { stories } from "../src/data/stories.ts";
import { company, socials, destinationMenu, reasons } from "../src/data/site.ts";

const payload = {
  company,
  socials,
  destinationMenu,
  reasons,
  packages,
  destinations,
  activities,
  testimonials,
  galleryItems,
  galleryCategories,
  stories,
};

writeFileSync(new URL("../../backend/seed.json", import.meta.url), JSON.stringify(payload));
console.log(
  `packages ${packages.length}, destinations ${destinations.length}, activities ${activities.length}, stories ${stories.length}`,
);
