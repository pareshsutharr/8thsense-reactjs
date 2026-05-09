import { Camera, Instagram, Video } from "lucide-react";

export const stockImages = {
  hero:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2400&q=85",
  campaign:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2400&q=85",
  photography:
    "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=2000&q=85",
  videography:
    "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=2200&q=85",
  social:
    "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=2200&q=85",
  collaboration:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=85",
  feedback:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=85",
  event:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=85",
  wedding:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85",
  studio:
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=2200&q=85",
};

export const heroTitle = "SPOTLIGHTING\nYOUR STORIES";

export const services = [
  {
    icon: Camera,
    title: "Photography",
    text: "Precision-led event, product, portrait, lifestyle, and brand photography for moments that need a lasting visual identity.",
  },
  {
    icon: Video,
    title: "Videography",
    text: "Cinematic shoots, reels, corporate videos, event films, music videos, and campaign content shaped for modern screens.",
  },
  {
    icon: Instagram,
    title: "Social Media Content",
    text: "Content planning, visual direction, short-form production, and scroll-stopping media for Instagram, Facebook, and campaigns.",
  },
];

export const portfolio = [
  { image: stockImages.event, title: "Event Coverage", tag: "Live moments" },
  { image: stockImages.wedding, title: "Wedding Stories", tag: "Celebration" },
  { image: stockImages.photography, title: "Portrait Direction", tag: "Photography" },
  { image: stockImages.videography, title: "Video Production", tag: "Cinematic shoot" },
  { image: stockImages.social, title: "Social Campaigns", tag: "Digital content" },
  { image: stockImages.studio, title: "Studio Production", tag: "Brand visuals" },
];
