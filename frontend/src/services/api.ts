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
};
