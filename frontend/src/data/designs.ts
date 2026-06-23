export interface NailDesign {
  id: string;
  nameKey: string; // Translation key path like 'designs.roseGold'
  defaultName: string;
  price: number;
  duration: number; // in minutes
  shape: "Almond" | "Coffin" | "Oval" | "Stiletto" | "Square";
  type: "Gel" | "Acrylic" | "French" | "Luxury" | "Minimalist" | "Chrome";
  rating: number;
  reviewsCount: number;
  colors: string[]; // hex color codes representing the palette
  image: string; // public folder URL path
  tags: string[];
}

export const nailDesigns: NailDesign[] = [
  {
    id: "rose-gold-elegance",
    nameKey: "roseGold",
    defaultName: "Rose Gold Elegance",
    price: 45,
    duration: 60,
    shape: "Almond",
    type: "Gel",
    rating: 4.9,
    reviewsCount: 124,
    colors: ["#B76E79", "#E8C3C9", "#D4AF37"],
    image: "/designs/rose-gold-elegance.png",
    tags: ["Gel", "Glitter", "Elegant", "Trending"],
  },
  {
    id: "classic-french-tips",
    nameKey: "classicFrench",
    defaultName: "Classic French Tips",
    price: 35,
    duration: 45,
    shape: "Oval",
    type: "French",
    rating: 4.8,
    reviewsCount: 210,
    colors: ["#FDF0ED", "#FFFFFF"],
    image: "/designs/classic-french-tips.png",
    tags: ["French", "Classic", "Short", "Minimalist"],
  },
  {
    id: "midnight-luxe",
    nameKey: "midnightLuxe",
    defaultName: "Midnight Luxe",
    price: 55,
    duration: 75,
    shape: "Coffin",
    type: "Luxury",
    rating: 5.0,
    reviewsCount: 88,
    colors: ["#111111", "#D4AF37", "#2C3E50"],
    image: "/designs/midnight-luxe.png",
    tags: ["Acrylic", "Luxury", "Gold Foil", "Dark Theme"],
  },
  {
    id: "bridal-blush",
    nameKey: "bridalBlush",
    defaultName: "Bridal Blush",
    price: 85,
    duration: 90,
    shape: "Almond",
    type: "Luxury",
    rating: 4.9,
    reviewsCount: 145,
    colors: ["#FFF0F2", "#F0C1C7", "#FFFFFF"],
    image: "/designs/bridal-blush.png",
    tags: ["Bridal", "Pearl Shimmer", "Gems", "Elegant"],
  },
  {
    id: "nude-minimalist",
    nameKey: "nudeMinimalist",
    defaultName: "Nude Minimalist",
    price: 30,
    duration: 40,
    shape: "Oval",
    type: "Minimalist",
    rating: 4.7,
    reviewsCount: 195,
    colors: ["#E5C7BC", "#D7B5A6"],
    image: "/designs/nude-minimalist.png",
    tags: ["Gel", "Minimalist", "Everyday", "Natural"],
  },
  {
    id: "cherry-blossom",
    nameKey: "cherryBlossom",
    defaultName: "Cherry Blossom",
    price: 50,
    duration: 70,
    shape: "Oval",
    type: "Gel",
    rating: 4.9,
    reviewsCount: 76,
    colors: ["#FFF0F5", "#FFB7C5", "#228B22"],
    image: "/designs/cherry-blossom.png",
    tags: ["Art", "Floral", "Pastel", "Spring"],
  },
  {
    id: "acrylic-galaxy",
    nameKey: "acrylicGalaxy",
    defaultName: "Acrylic Galaxy",
    price: 65,
    duration: 80,
    shape: "Stiletto",
    type: "Acrylic",
    rating: 4.8,
    reviewsCount: 64,
    colors: ["#3D0C5A", "#0F2042", "#8E44AD"],
    image: "/designs/acrylic-galaxy.png",
    tags: ["Acrylic", "Galaxy", "Glitter", "Bold"],
  },
  {
    id: "gel-ombre-sunset",
    nameKey: "gelOmbreSunset",
    defaultName: "Gel Ombre Sunset",
    price: 45,
    duration: 60,
    shape: "Square",
    type: "Gel",
    rating: 4.9,
    reviewsCount: 112,
    colors: ["#FF7F50", "#FF6B8B", "#FFD166"],
    image: "/designs/gel-ombre-sunset.png",
    tags: ["Gel", "Ombre", "Sunset", "Vibrant"],
  },
];
