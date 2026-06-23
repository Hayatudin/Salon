"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { nailDesigns, NailDesign } from "../../data/designs";
import { apiService, CustomDesignData } from "../../services/api";
import { Heart, Paintbrush, Calendar, Trash2, Clock, Eye, AlertCircle } from "lucide-react";
import GlassCard from "../../components/GlassCard";

// Map gallery image assets
const designImages: Record<string, string> = {
  "rose-gold-elegance": "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
  "classic-french-tips": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80",
  "midnight-luxe": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
  "bridal-blush": "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=600&q=80",
  "nude-minimalist": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  "cherry-blossom": "https://images.unsplash.com/photo-1610992015732-2449b76e443a?auto=format&fit=crop&w=600&q=80",
  "acrylic-galaxy": "https://images.unsplash.com/photo-1632345031435-8797b2d58045?auto=format&fit=crop&w=600&q=80",
  "gel-ombre-sunset": "https://images.unsplash.com/photo-1560869713-7d0a294308ee?auto=format&fit=crop&w=600&q=80",
};

export default function Favorites() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"gallery" | "custom">("gallery");
  
  // Data lists
  const [favDesigns, setFavDesigns] = useState<NailDesign[]>([]);
  const [customDesignsList, setCustomDesignsList] = useState<CustomDesignData[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    // 1. Load Gallery Favorites
    const savedFavIds = localStorage.getItem("luxe_favorites");
    if (savedFavIds) {
      const ids: string[] = JSON.parse(savedFavIds);
      const filtered = nailDesigns.filter((d) => ids.includes(d.id));
      setFavDesigns(filtered);
    }

    // 2. Load Custom Creations
    const customList = await apiService.getCustomDesigns();
    setCustomDesignsList(customList);
  };

  const removeGalleryFavorite = (id: string) => {
    const savedFavIds = localStorage.getItem("luxe_favorites");
    if (savedFavIds) {
      const ids: string[] = JSON.parse(savedFavIds);
      const updated = ids.filter((fid) => fid !== id);
      localStorage.setItem("luxe_favorites", JSON.stringify(updated));
      setFavDesigns(favDesigns.filter((d) => d.id !== id));
    }
  };

  const removeCustomDesign = (id: string) => {
    const saved = localStorage.getItem("luxe_custom-designs");
    if (saved) {
      const items: CustomDesignData[] = JSON.parse(saved);
      const updated = items.filter((item) => item.id !== id);
      localStorage.setItem("luxe_custom-designs", JSON.stringify(updated));
    }
    // Also remove from state list
    setCustomDesignsList(customDesignsList.filter((cd) => cd.id !== id));
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-wide">
          {t("favorites.title")}
        </h1>
        <p className="text-sm sm:text-base text-foreground/75 max-w-xl mx-auto leading-relaxed">
          {t("favorites.subtitle")}
        </p>
      </div>

      {/* Tabs Menu Panel */}
      <div className="flex justify-center border-b border-border/30 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "gallery"
              ? "border-luxe-rose text-luxe-rose font-bold"
              : "border-transparent text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {t("favorites.galleryTab")} ({favDesigns.length})
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "custom"
              ? "border-luxe-rose text-luxe-rose font-bold"
              : "border-transparent text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {t("favorites.customTab")} ({customDesignsList.length})
        </button>
      </div>

      {/* Dynamic Tab Contents */}
      {activeTab === "gallery" ? (
        favDesigns.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {favDesigns.map((design) => (
              <GlassCard
                key={design.id}
                className="border border-border/80 p-0 rounded-2xl overflow-hidden flex flex-col group relative"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={designImages[design.id] || design.image}
                    alt={design.defaultName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <button
                    onClick={() => removeGalleryFavorite(design.id)}
                    className="absolute right-3 top-3 p-2.5 rounded-full glass-effect border border-white/10 text-red-500 hover:scale-110 transition-transform"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between bg-card text-foreground">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-luxe-rose block">
                      {design.shape} &bull; {design.type}
                    </span>
                    <h3 className="font-serif font-bold text-sm mt-1">{design.defaultName}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <span className="text-xs font-bold text-luxe-rose">${design.price}</span>
                    <Link
                      href={`/book?service=${encodeURIComponent(design.defaultName)}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-gradient text-white rounded-lg text-[10px] font-bold shadow-md shadow-luxe-rose/25 hover:opacity-90"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-md mx-auto space-y-4">
            <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto" />
            <p className="text-foreground/75 leading-relaxed">{t("favorites.noFavorites")}</p>
            <div className="pt-2">
              <Link
                href="/gallery"
                className="inline-flex items-center space-x-2 px-6 py-2 bg-rose-gradient text-white rounded-xl text-sm font-semibold shadow-md shadow-luxe-rose/25"
              >
                <span>Browse Gallery</span>
              </Link>
            </div>
          </div>
        )
      ) : (
        /* CUSTOM CREATIONS GRID */
        customDesignsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customDesignsList.map((item) => (
              <GlassCard
                key={item.id}
                className="border border-border/80 p-5 rounded-2xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-bold text-base text-foreground leading-snug">{item.name}</h3>
                      <p className="text-[10px] text-foreground/50 mt-0.5">Created on {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => removeCustomDesign(item.id)}
                      className="p-2 border border-border/55 text-foreground/55 hover:text-red-500 hover:border-red-500/30 rounded-lg transition-colors"
                      title="Delete design"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Render design tags visual badge summary */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/30">
                    <div className="bg-luxe-rose/5 p-2 rounded-lg">
                      <span className="text-[9px] text-foreground/45 uppercase tracking-wide block">Nail Shape</span>
                      <span className="font-bold">{item.shape}</span>
                    </div>
                    <div className="bg-luxe-rose/5 p-2 rounded-lg">
                      <span className="text-[9px] text-foreground/45 uppercase tracking-wide block">Base Color</span>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-border/50" style={{ backgroundColor: item.color }} />
                        <span className="font-bold font-mono text-[10px]">{item.color.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="bg-luxe-rose/5 p-2 rounded-lg">
                      <span className="text-[9px] text-foreground/45 uppercase tracking-wide block">Finish Texture</span>
                      <span className="font-bold">{item.texture}</span>
                    </div>
                    <div className="bg-luxe-rose/5 p-2 rounded-lg">
                      <span className="text-[9px] text-foreground/45 uppercase tracking-wide block">Decoration</span>
                      <span className="font-bold">{item.decor}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/30 flex gap-2">
                  {/* Try-on link */}
                  <Link
                    href={`/try-on?shape=${encodeURIComponent(item.shape)}`}
                    className="flex-1 inline-flex items-center justify-center space-x-1 px-4 py-2 border border-border hover:bg-luxe-rose/5 rounded-xl text-xs font-semibold text-foreground transition-colors"
                  >
                    <Eye className="w-4 h-4 text-foreground/70" />
                    <span>Try On</span>
                  </Link>

                  {/* Book appointment link */}
                  <Link
                    href={`/book?notes=${encodeURIComponent(`Custom Design: ${item.name} (${item.shape}, ${item.color}, ${item.texture}, ${item.decor})`)}`}
                    className="flex-1 inline-flex items-center justify-center space-x-1 px-4 py-2 bg-rose-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-luxe-rose/25"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Set</span>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-md mx-auto space-y-4">
            <Paintbrush className="w-12 h-12 text-foreground/30 mx-auto" />
            <p className="text-foreground/75 leading-relaxed">You haven't created any custom nail sets yet. Express your creativity in the Studio!</p>
            <div className="pt-2">
              <Link
                href="/custom-studio"
                className="inline-flex items-center space-x-2 px-6 py-2 bg-rose-gradient text-white rounded-xl text-sm font-semibold shadow-md shadow-luxe-rose/25"
              >
                <span>Open Design Studio</span>
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
}
