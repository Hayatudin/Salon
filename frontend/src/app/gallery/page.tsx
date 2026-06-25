"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { NailDesign } from "../../data/designs";
import { dynamicDesignService } from "../../services/designs";
import { Search, Heart, Clock, DollarSign, X, Check, Calendar } from "lucide-react";
import GlassCard from "../../components/GlassCard";

export default function Gallery() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedShape, setSelectedShape] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<NailDesign | null>(null);

  // Dynamic designs from backend
  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load designs from backend API
  useEffect(() => {
    setIsLoading(true);
    dynamicDesignService.getDesigns().then((loaded) => {
      setDesigns(loaded);
      setIsLoading(false);
    });
  }, []);

  // Load favorites from local storage
  useEffect(() => {
    const saved = localStorage.getItem("luxe_favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Read ?shape= query param from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const shapeParam = params.get("shape");
      if (shapeParam) {
        setSelectedShape(shapeParam);
      }
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("luxe_favorites", JSON.stringify(updated));
  };

  // Build dynamic filter options from the loaded designs
  const shapeOptions = ["All", ...Array.from(new Set(designs.map((d) => d.shape).filter(Boolean)))];
  const typeOptions = ["All", ...Array.from(new Set(designs.map((d) => d.type).filter(Boolean)))];

  // Filter calculation
  const filteredDesigns = designs.filter((design) => {
    const nameMatch = design.defaultName.toLowerCase().includes(search.toLowerCase());
    const shapeMatch = selectedShape === "All" || design.shape === selectedShape;
    const typeMatch = selectedType === "All" || design.type === selectedType;
    return nameMatch && shapeMatch && typeMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-32 py-10 w-full space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-wide">
          {t("gallery.title")}
        </h1>
        <p className="text-sm sm:text-base text-foreground/75 max-w-xl mx-auto leading-relaxed">
          {t("gallery.subtitle")}
        </p>
      </div>

      {/* Advanced Filters Dashboard */}
      <GlassCard className="border border-border/80 p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/50" />
            <input
              type="text"
              placeholder={t("gallery.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:border-luxe-rose focus:ring-1 focus:ring-luxe-rose/25 text-sm outline-none text-foreground"
            />
          </div>

          {/* Shape filter */}
          <div className="flex items-center space-x-2 md:col-span-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest shrink-0">
              {t("gallery.shape")}:
            </span>
            <div className="flex space-x-1.5">
              {shapeOptions.map((shape) => (
                <button
                  key={shape}
                  onClick={() => setSelectedShape(shape)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                    selectedShape === shape
                      ? "bg-rose-gradient text-white border-transparent shadow-md shadow-luxe-rose/20"
                      : "border-border text-foreground hover:bg-luxe-rose/5"
                  }`}
                >
                  {shape === "All" ? t("gallery.filterAll") : shape}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center space-x-2 border-t border-border/30 pt-4 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest shrink-0">
            {t("gallery.type")}:
          </span>
          <div className="flex space-x-1.5">
            {typeOptions.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                  selectedType === type
                    ? "bg-rose-gradient text-white border-transparent shadow-md shadow-luxe-rose/20"
                    : "border-border text-foreground hover:bg-luxe-rose/5"
                }`}
              >
                {type === "All" ? t("gallery.filterAll") : type}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-luxe-rose/30 border-t-luxe-rose animate-spin mx-auto"></div>
          <p className="text-sm text-foreground/50 font-semibold">Loading gallery designs...</p>
        </div>
      ) : filteredDesigns.length > 0 ? (
        /* Grid of Designs */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => {
            const isFav = favorites.includes(design.id);
            return (
              <motion.div
                key={design.id}
                layoutId={`card-${design.id}`}
                onClick={() => setSelectedDesign(design)}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg flex flex-col cursor-pointer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Heart favorite button */}
                <button
                  onClick={(e) => toggleFavorite(design.id, e)}
                  className="absolute right-3 top-3 z-20 p-2.5 rounded-full glass-effect border border-white/10 text-white hover:scale-110 transition-transform duration-200"
                >
                  <Heart
                    className={`w-4 h-4 transition-all duration-200 ${
                      isFav ? "fill-red-500 text-red-500 scale-105" : "text-white"
                    }`}
                  />
                </button>

                {/* Main Design Image */}
                <div className="relative aspect-square overflow-hidden bg-luxe-gradient/50">
                  <Image
                    src={design.image}
                    alt={design.defaultName}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized={design.image.startsWith("/uploads")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxe-burgundy/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Footer description details */}
                <div className="p-4 flex-grow flex flex-col justify-between bg-card text-foreground">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-luxe-rose">
                      <span>{design.type}</span>
                      <span>{design.shape}</span>
                    </div>
                    <h3 className="font-serif font-bold text-sm tracking-wide mt-1 leading-snug group-hover:text-luxe-rose transition-colors duration-200">
                      {design.defaultName}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/30">
                    <span className="text-xs text-foreground/50 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {design.duration}m
                    </span>
                    <span className="text-sm font-bold text-luxe-rose">${design.price}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground/50 text-base">No designs found matching your filters.</p>
        </div>
      )}

      {/* Modal Overlay Detail Drawer */}
      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedDesign(null)}
          >
            <motion.div
              layoutId={`card-${selectedDesign.id}`}
              className="glass-effect max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border border-border bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Large visual preview */}
                <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px]">
                  <Image
                    src={selectedDesign.image}
                    alt={selectedDesign.defaultName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={selectedDesign.image.startsWith("/uploads")}
                  />
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="absolute top-4 left-4 p-2 rounded-full glass-effect border text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details layout page */}
                <div className="p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-rose">
                          {selectedDesign.type} &bull; {selectedDesign.shape}
                        </span>
                        <h2 className="text-2xl font-serif font-bold text-foreground mt-1">
                          {selectedDesign.defaultName}
                        </h2>
                      </div>
                      
                      <button
                        onClick={(e) => toggleFavorite(selectedDesign.id, e)}
                        className={`p-2.5 rounded-full border transition-colors ${
                          favorites.includes(selectedDesign.id)
                            ? "bg-rose-500/10 border-luxe-rose text-luxe-rose"
                            : "border-border text-foreground hover:bg-luxe-rose/10"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(selectedDesign.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <p className="text-sm text-foreground/75 leading-relaxed">
                      This gorgeous set highlights the signature {selectedDesign.shape.toLowerCase()} silhouette, customized with a detailed {selectedDesign.type.toLowerCase()} overlay. Designed by our top stylists using 100% sterile tools and premium pigments.
                    </p>

                    {/* Color Blocks Palette */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest block">
                        Color Palette
                      </span>
                      <div className="flex space-x-2">
                        {selectedDesign.colors.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-8 h-8 rounded-full border border-border shadow-inner flex items-center justify-center group"
                            style={{ backgroundColor: color }}
                            title={color}
                          >
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] bg-black text-white px-1 rounded absolute -translate-y-6">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary row */}
                    <div className="grid grid-cols-2 gap-4 border-t border-b border-border/30 py-4 mt-6">
                      <div className="flex items-center space-x-2.5">
                        <Clock className="w-5 h-5 text-luxe-rose" />
                        <div>
                          <p className="text-[10px] text-foreground/50 uppercase tracking-wider">{t("gallery.duration")}</p>
                          <p className="text-sm font-bold">{selectedDesign.duration} Minutes</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <DollarSign className="w-5 h-5 text-luxe-rose" />
                        <div>
                          <p className="text-[10px] text-foreground/50 uppercase tracking-wider">{t("gallery.price")}</p>
                          <p className="text-sm font-bold">${selectedDesign.price} USD</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-col gap-3">
                    <Link
                      href={`/book?service=${encodeURIComponent(selectedDesign.defaultName)}&notes=${encodeURIComponent(`Design selected: ${selectedDesign.defaultName}`)}`}
                      className="flex items-center justify-center space-x-2 w-full py-3.5 bg-rose-gradient text-white rounded-xl font-bold text-sm shadow-lg shadow-luxe-rose/25 hover:opacity-95 transition-opacity duration-200"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{t("gallery.bookStyleBtn")}</span>
                    </Link>

                    <button
                      onClick={() => setSelectedDesign(null)}
                      className="w-full py-3 border border-border hover:bg-luxe-rose/5 rounded-xl font-semibold text-sm text-foreground transition-colors duration-200"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
