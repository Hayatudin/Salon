import { NailDesign } from "../data/designs";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface BookingData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  artist: string;
  date: string;
  time: string;
  notes?: string;
  customDesignId?: string;
  createdAt?: string;
}

export interface ReviewData {
  id?: string;
  name: string;
  rating: number;
  text: string;
  service: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface CustomDesignData {
  id: string;
  name: string;
  shape: string;
  color: string;
  texture: string;
  decor: string;
  createdAt: string;
}

// Fallback helper to store local mock items if backend is not running
const getLocalData = <T>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(`luxe_${key}`);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalData = <T>(key: string, items: T[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`luxe_${key}`, JSON.stringify(items));
};

export const apiService = {
  // Appointments API
  async createAppointment(booking: BookingData): Promise<BookingData> {
    try {
      const response = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!response.ok) throw new Error("Server error");
      return await response.ok ? response.json() : booking;
    } catch (e) {
      console.warn("Backend API offline, saving appointment to localStorage mock db.", e);
      const items = getLocalData<BookingData>("appointments");
      const newItem = { ...booking, id: `bk-${Date.now()}`, createdAt: new Date().toISOString() };
      items.push(newItem);
      saveLocalData("appointments", items);
      return newItem;
    }
  },

  async getAppointments(): Promise<BookingData[]> {
    try {
      const response = await fetch(`${BASE_URL}/appointments`);
      if (!response.ok) throw new Error("Server error");
      return await response.json();
    } catch (e) {
      console.warn("Backend API offline, retrieving appointments from localStorage.", e);
      return getLocalData<BookingData>("appointments");
    }
  },

  // Testimonials API
  async createReview(review: ReviewData): Promise<ReviewData> {
    try {
      const response = await fetch(`${BASE_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (!response.ok) throw new Error("Server error");
      return await response.json();
    } catch (e) {
      console.warn("Backend API offline, saving testimonial to localStorage.", e);
      const items = getLocalData<ReviewData>("testimonials");
      const newItem = { ...review, id: `rev-${Date.now()}`, createdAt: new Date().toISOString() };
      items.push(newItem);
      saveLocalData("testimonials", items);
      return newItem;
    }
  },

  async getReviews(): Promise<ReviewData[]> {
    try {
      const response = await fetch(`${BASE_URL}/testimonials`);
      if (!response.ok) throw new Error("Server error");
      return await response.json();
    } catch (e) {
      console.warn("Backend API offline, retrieving testimonials from localStorage.", e);
      const local = getLocalData<ReviewData>("testimonials");
      // Pre-seed if empty
      if (local.length === 0) {
        const seed: ReviewData[] = [
          { id: "s1", name: "Sara M.", rating: 5, text: "Hani is a true artist! My acrylic extensions are perfect and lasted for weeks.", service: "Acrylic Extensions", avatarUrl: "" },
          { id: "s2", name: "Hanna T.", rating: 5, text: "The studio is beautiful, and the service is next-level. Best spa pedicure in town!", service: "Luxury Spa Pedicure", avatarUrl: "" },
          { id: "s3", name: "Liya K.", rating: 4.8, text: "Loved the AI matching assistant and the final gel nail design was spot on.", service: "Gel Polish Manicure", avatarUrl: "" },
        ];
        saveLocalData("testimonials", seed);
        return seed;
      }
      return local;
    }
  },

  // Custom Nail Designs API
  async saveCustomDesign(design: CustomDesignData): Promise<CustomDesignData> {
    try {
      const response = await fetch(`${BASE_URL}/custom-designs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
      });
      if (!response.ok) throw new Error("Server error");
      return await response.json();
    } catch (e) {
      console.warn("Backend API offline, saving custom design to localStorage.", e);
      const items = getLocalData<CustomDesignData>("custom-designs");
      items.push(design);
      saveLocalData("custom-designs", items);
      return design;
    }
  },

  async getCustomDesigns(): Promise<CustomDesignData[]> {
    try {
      const response = await fetch(`${BASE_URL}/custom-designs`);
      if (!response.ok) throw new Error("Server error");
      return await response.json();
    } catch (e) {
      console.warn("Backend API offline, retrieving custom designs from localStorage.", e);
      return getLocalData<CustomDesignData>("custom-designs");
    }
  },

  // AI Assistant Chatbot API
  async askAiAssistant(message: string, history: { sender: "user" | "bot"; text: string }[], outfitColors?: string[]): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, outfitColors }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      return data.reply;
    } catch (e) {
      console.warn("Backend API offline, using local AI chatbot fallback engine.", e);
      // Local fallback logic
      const lower = message.toLowerCase();
      if (outfitColors && outfitColors.length > 0) {
        return `I've analyzed your outfit colors (${outfitColors.join(", ")}). I highly recommend our "Rose Gold Elegance" design for a glowing accent, or "Classic French Tips" for timeless styling that won't compete with your dress. Let me know if you would like me to show these in the gallery!`;
      }
      if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
        return "Our pricing ranges from $30 for a clean Nude Minimalist set up to $85 for a detailed Bridal Package. You can check the complete list in our Gallery details or on the Book Now page.";
      }
      if (lower.includes("wedding") || lower.includes("marriage") || lower.includes("bridal")) {
        return "For weddings, we recommend our specialized 'Bridal Blush' or the elegant 'Rose Gold Elegance'. They feature beautiful shimmers and custom art details suitable for your special day.";
      }
      if (lower.includes("dark") || lower.includes("black") || lower.includes("night")) {
        return "If you like deep colors, you must try 'Midnight Luxe'! It is a beautiful coffin shape in matte black with gold foil outlines. It's one of our trending styles.";
      }
      if (lower.includes("skin") || lower.includes("tone") || lower.includes("suit")) {
        return "For warmer skin tones, gold shimmer or coral ombres ('Gel Ombre Sunset') look amazing. For cooler skin tones, we recommend deep berries or icy silvers like 'Acrylic Galaxy'. Nudes and classic french tips look gorgeous on all skin tones!";
      }
      return "Hello! I am your Hani Luxe Assistant. I can help recommend nail styles, colors that match your skin tone or outfit, and booking assistance. Try asking 'What suits a wedding dress?' or upload your outfit photo above!";
    }
  },

  // Users Password API
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }
      return { success: true, message: data.message };
    } catch (e: any) {
      console.error("Change password error:", e);
      return { success: false, error: e.message || "Failed to update password. Please check your connection." };
    }
  },

  // Collections API
  async getCollections(): Promise<CollectionData[]> {
    try {
      const response = await fetch(`${BASE_URL}/collections`);
      if (!response.ok) throw new Error("Server error");
      return await response.json();
    } catch (e) {
      console.warn("Backend API offline, retrieving collections from localStorage.", e);
      const local = getLocalData<CollectionData>("collections");
      if (local.length === 0) {
        const seed: CollectionData[] = [
          { id: "c1", name: "Almond", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80" },
          { id: "c2", name: "Oval", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80" },
          { id: "c3", name: "Coffin", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
          { id: "c4", name: "Square", image: "https://images.unsplash.com/photo-1560869713-7d0a294308ee?auto=format&fit=crop&w=600&q=80" },
          { id: "c5", name: "Stiletto", image: "https://images.unsplash.com/photo-1632345031435-8797b2d58045?auto=format&fit=crop&w=600&q=80" },
        ];
        saveLocalData("collections", seed);
        return seed;
      }
      return local;
    }
  },

  async createCollection(collection: Omit<CollectionData, "id">): Promise<CollectionData> {
    try {
      const response = await fetch(`${BASE_URL}/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collection),
      });
      if (!response.ok) throw new Error("Server error");
      return await response.json();
    } catch (e) {
      console.warn("Backend API offline, saving collection to localStorage.", e);
      const items = getLocalData<CollectionData>("collections");
      const newItem = { ...collection, id: `coll-${Date.now()}`, createdAt: new Date().toISOString() };
      items.push(newItem);
      saveLocalData("collections", items);
      return newItem;
    }
  },

  async deleteCollection(idOrName: string): Promise<boolean> {
    try {
      const isId = idOrName.startsWith("coll-") || idOrName.startsWith("c");
      const url = isId 
        ? `${BASE_URL}/collections?id=${idOrName}` 
        : `${BASE_URL}/collections?name=${encodeURIComponent(idOrName)}`;
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error("Server error");
      return true;
    } catch (e) {
      console.warn("Backend API offline, deleting collection from localStorage.", e);
      const items = getLocalData<CollectionData>("collections");
      const filtered = items.filter((item) => item.id !== idOrName && item.name !== idOrName);
      saveLocalData("collections", filtered);
      return true;
    }
  },

  // Designs API
  async getDesigns(): Promise<NailDesign[]> {
    try {
      const response = await fetch(`${BASE_URL}/designs`);
      if (!response.ok) throw new Error("Server error");
      const list = await response.json();
      return list.map((d: any) => ({
        id: d.id,
        nameKey: d.nameKey,
        defaultName: d.defaultName,
        price: d.price,
        duration: d.duration,
        shape: d.shape as any,
        type: d.type as any,
        rating: d.rating,
        reviewsCount: d.reviewsCount,
        colors: d.colors ? d.colors.split(",") : [],
        image: d.image,
        tags: d.tags ? d.tags.split(",") : [],
        collectionId: d.collectionId
      }));
    } catch (e) {
      console.warn("Backend API offline, retrieving designs from localStorage.", e);
      const local = getLocalData<NailDesign>("designs");
      if (local.length === 0) {
        // Fallback seed
        const seed: NailDesign[] = [
          { id: "rose-gold-elegance", nameKey: "roseGold", defaultName: "Rose Gold Elegance", price: 45, duration: 60, shape: "Almond", type: "Gel", rating: 4.9, reviewsCount: 124, colors: ["#B76E79", "#E8C3C9", "#D4AF37"], image: "/designs/rose-gold-elegance.png", tags: ["Gel", "Glitter", "Elegant", "Trending"] },
          { id: "classic-french-tips", nameKey: "classicFrench", defaultName: "Classic French Tips", price: 35, duration: 45, shape: "Oval", type: "French", rating: 4.8, reviewsCount: 210, colors: ["#FDF0ED", "#FFFFFF"], image: "/designs/classic-french-tips.png", tags: ["French", "Classic", "Short", "Minimalist"] },
          { id: "midnight-luxe", nameKey: "midnightLuxe", defaultName: "Midnight Luxe", price: 55, duration: 75, shape: "Coffin", type: "Luxury", rating: 5.0, reviewsCount: 88, colors: ["#111111", "#D4AF37", "#2C3E50"], image: "/designs/midnight-luxe.png", tags: ["Acrylic", "Luxury", "Gold Foil", "Dark Theme"] },
          { id: "bridal-blush", nameKey: "bridalBlush", defaultName: "Bridal Blush", price: 85, duration: 90, shape: "Almond", type: "Luxury", rating: 4.9, reviewsCount: 145, colors: ["#FFF0F2", "#F0C1C7", "#FFFFFF"], image: "/designs/bridal-blush.png", tags: ["Bridal", "Pearl Shimmer", "Gems", "Elegant"] },
          { id: "nude-minimalist", nameKey: "nudeMinimalist", defaultName: "Nude Minimalist", price: 30, duration: 40, shape: "Oval", type: "Minimalist", rating: 4.7, reviewsCount: 195, colors: ["#E5C7BC", "#D7B5A6"], image: "/designs/nude-minimalist.png", tags: ["Gel", "Minimalist", "Everyday", "Natural"] },
          { id: "cherry-blossom", nameKey: "cherryBlossom", defaultName: "Cherry Blossom", price: 50, duration: 70, shape: "Oval", type: "Gel", rating: 4.9, reviewsCount: 76, colors: ["#FFF0F5", "#FFB7C5", "#228B22"], image: "/designs/cherry-blossom.png", tags: ["Art", "Floral", "Pastel", "Spring"] },
          { id: "acrylic-galaxy", nameKey: "acrylicGalaxy", defaultName: "Acrylic Galaxy", price: 65, duration: 80, shape: "Stiletto", type: "Acrylic", rating: 4.8, reviewsCount: 92, colors: ["#0F0C20", "#3E1E68", "#9E00C5", "#FFFFFF"], image: "/designs/acrylic-galaxy.png", tags: ["Acrylic", "Glitter", "Galaxy", "Art"] },
          { id: "gel-ombre-sunset", nameKey: "gelOmbre", defaultName: "Gel Ombre Sunset", price: 40, duration: 50, shape: "Square", type: "Gel", rating: 4.7, reviewsCount: 104, colors: ["#FF8C00", "#FF69B4", "#FFF0F5"], image: "/designs/gel-ombre-sunset.png", tags: ["Gel", "Ombre", "Summer", "Square"] }
        ];
        saveLocalData("designs", seed);
        return seed;
      }
      return local;
    }
  },

  async createDesign(design: Omit<NailDesign, "id">): Promise<NailDesign> {
    try {
      const response = await fetch(`${BASE_URL}/designs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
      });
      if (!response.ok) throw new Error("Server error");
      const d = await response.json();
      return {
        id: d.id,
        nameKey: d.nameKey,
        defaultName: d.defaultName,
        price: d.price,
        duration: d.duration,
        shape: d.shape as any,
        type: d.type as any,
        rating: d.rating,
        reviewsCount: d.reviewsCount,
        colors: d.colors ? d.colors.split(",") : [],
        image: d.image,
        tags: d.tags ? d.tags.split(",") : [],
        collectionId: d.collectionId
      };
    } catch (e) {
      console.warn("Backend API offline, saving design to localStorage.", e);
      const items = getLocalData<NailDesign>("designs");
      const newItem = { ...design, id: `design-${Date.now()}` };
      items.push(newItem as any);
      saveLocalData("designs", items);
      return newItem as any;
    }
  },

  async updateDesign(id: string, updatedData: Partial<NailDesign>): Promise<NailDesign | null> {
    try {
      const response = await fetch(`${BASE_URL}/designs?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Server error");
      const d = await response.json();
      return {
        id: d.id,
        nameKey: d.nameKey,
        defaultName: d.defaultName,
        price: d.price,
        duration: d.duration,
        shape: d.shape as any,
        type: d.type as any,
        rating: d.rating,
        reviewsCount: d.reviewsCount,
        colors: d.colors ? d.colors.split(",") : [],
        image: d.image,
        tags: d.tags ? d.tags.split(",") : [],
        collectionId: d.collectionId
      };
    } catch (e) {
      console.warn("Backend API offline, updating design in localStorage.", e);
      const items = getLocalData<NailDesign>("designs");
      const index = items.findIndex((d) => d.id === id);
      if (index === -1) return null;
      const updated = { ...items[index], ...updatedData };
      items[index] = updated;
      saveLocalData("designs", items);
      return updated;
    }
  },

  async deleteDesign(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/designs?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Server error");
      return true;
    } catch (e) {
      console.warn("Backend API offline, deleting design from localStorage.", e);
      const items = getLocalData<NailDesign>("designs");
      const filtered = items.filter((d) => d.id !== id);
      saveLocalData("designs", filtered);
      return true;
    }
  }
};

export interface CollectionData {
  id?: string;
  name: string;
  image: string;
  createdAt?: string;
}


