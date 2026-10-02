import type { GalleryItem } from "../types";

export const galleryItems: GalleryItem[] = [
  { id: "g1", src: "/images/everest.jpg", alt: "Stone trail, prayer flags, and a stupa with snow peaks behind", title: "Khumbu trail", category: "Destinations" },
  { id: "g2", src: "/images/kathmandu.jpg", alt: "Golden stupa and strings of prayer flags against a blue sky", title: "Kathmandu stupa", category: "Culture" },
  { id: "g3", src: "/images/pokhara.jpg", alt: "Aerial view of a great white stupa in a dense city", title: "Boudhanath from above", category: "Culture", tall: true },
  { id: "g4", src: "/images/ebc.jpg", alt: "A sea of snow peaks under a deep blue sky", title: "High Himalaya", category: "Nature" },
  { id: "g5", src: "/images/annapurna.jpg", alt: "A trekker on a snowy ridge with clouds below", title: "Annapurna ridge", category: "Adventure", tall: true },
  { id: "g6", src: "/images/hike.jpg", alt: "Hiker with a red pack walking a green mountain path", title: "On the trail", category: "People" },
  { id: "g7", src: "/images/trek2.jpg", alt: "Hiker standing on a rocky summit cairn", title: "Summit morning", category: "Adventure" },
  { id: "g8", src: "/images/alps.jpg", alt: "Sunrise above a sea of clouds with a dark peak", title: "Above the clouds", category: "Nature" },
  { id: "g9", src: "/images/stupa.jpg", alt: "Ornate Himalayan monastery with red and gold roofs", title: "Monastery roofs", category: "Culture" },
  { id: "g10", src: "/images/raft.jpg", alt: "Two rafters in whitewater", title: "River day", category: "Adventure" },
  { id: "g11", src: "/images/elephant.jpg", alt: "An elephant in a dark forest", title: "Forest wildlife", category: "Nature", tall: true },
  { id: "g12", src: "/images/people.jpg", alt: "Friends sitting together looking at a mountain view", title: "The group", category: "People" },
  { id: "g13", src: "/images/camp.jpg", alt: "Orange tent pitched with mountains beyond the door", title: "High camp", category: "Tours" },
  { id: "g14", src: "/images/night.jpg", alt: "Stars over a line of snow peaks", title: "Night sky", category: "Nature" },
  { id: "g15", src: "/images/peak.jpg", alt: "A sharp snow pyramid above rocky slopes", title: "A single peak", category: "Destinations" },
  { id: "g16", src: "/images/snow.jpg", alt: "Snow-dusted summit above a golden valley", title: "Clearing weather", category: "Destinations" },
  { id: "g17", src: "/images/tent.jpg", alt: "Travelers gathered around a campfire", title: "Camp evening", category: "People" },
  { id: "g18", src: "/images/cycle.jpg", alt: "Two road cyclists riding together", title: "Valley ride", category: "Adventure" },
  { id: "g19", src: "/images/camera.jpg", alt: "Camera, lenses, and printed photographs on a table", title: "Field kit", category: "Tours" },
  { id: "g20", src: "/images/monk2.jpg", alt: "A peak catching pink sunrise light", title: "First light", category: "Destinations" },
  { id: "g21", src: "/images/boudha.jpg", alt: "Blue mist over a long mountain ridge", title: "Ridge weather", category: "Nature", tall: true },
  { id: "g22", src: "/images/valley.jpg", alt: "Forested mountains in soft light", title: "Mid-hills", category: "Tours" },
  { id: "g23", src: "/images/fog.jpg", alt: "Green valley opening toward distant peaks", title: "Valley walk", category: "Destinations" },
  { id: "g24", src: "/images/flight.jpg", alt: "Airplane wing above a layer of cloud", title: "Mountain flight", category: "Tours" },
];

export const galleryCategories = ["All", "Destinations", "Adventure", "Culture", "Nature", "People", "Tours"] as const;
