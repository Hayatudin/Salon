"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiService, CustomDesignData } from "../../services/api";
import { Sparkles, Palette, Paintbrush, ShieldCheck, Heart, ArrowRight, Save, Check } from "lucide-react";
import GlassCard from "../../components/GlassCard";

const presets = [
  { name: "Blush Pink", hex: "#E8C3C9" },
  { name: "Luxury Gold", hex: "#D4AF37" },
  { name: "Burgundy Velvet", hex: "#4A0220" },
  { name: "Midnight Onyx", hex: "#111111" },
  { name: "Sky Glaze", hex: "#ADD8E6" },
  { name: "Satin Emerald", hex: "#2E8B57" },
];

export default function CustomStudio() {
  const { t } = useLanguage();
  
  // Custom Studio Customization States
  const [shape, setShape] = useState<string>("Almond");
  const [color, setColor] = useState<string>("#E8C3C9");
  const [texture, setTexture] = useState<string>("Glossy");
  const [decor, setDecor] = useState<string>("None");
  const [name, setName] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");

  const saveDesign = async () => {
    if (!name.trim()) return;
    setSaveStatus("saving");
    
    const designData: CustomDesignData = {
      id: `cd-${Date.now()}`,
      name: name.trim(),
      shape,
      color,
      texture,
      decor,
      createdAt: new Date().toISOString(),
    };

    await apiService.saveCustomDesign(designData);
    
    setSaveStatus("success");
    setTimeout(() => {
      setSaveStatus("idle");
      setName("");
    }, 2000);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-wide">
          {t("customStudio.title")}
        </h1>
        <p className="text-sm sm:text-base text-foreground/75 max-w-xl mx-auto leading-relaxed">
          {t("customStudio.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
        {/* Visualizer Canvas Left Panel (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
          <div className="relative rounded-3xl border border-border shadow-2xl bg-gradient-to-br from-luxe-dark-burgundy to-luxe-burgundy/40 w-full max-w-[380px] aspect-[4/5] flex items-center justify-center p-8 overflow-hidden">
            {/* Soft background light */}
            <div
              className="absolute w-48 h-48 rounded-full blur-[70px] opacity-35"
              style={{ backgroundColor: color }}
            />

            {/* SVG Interactive Nail Visualizer */}
            <div className="relative w-48 h-72 flex items-center justify-center">
              <svg
                viewBox="0 0 100 150"
                className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
              >
                <defs>
                  {/* Polish Color Base Shading */}
                  <linearGradient id="polishGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                  </linearGradient>

                  {/* Highlights reflecting texture */}
                  <linearGradient id="highlightGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={texture === "Chrome" ? 0.6 : 0.4} />
                    <stop offset="30%" stopColor="#FFFFFF" stopOpacity={texture === "Chrome" ? 0.3 : 0.1} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>

                  {/* Glitter Pattern Shimmer */}
                  <pattern id="glitterPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1.5" fill="#FFFFFF" opacity="0.7" />
                    <circle cx="15" cy="12" r="1" fill="#FFFFFF" opacity="0.5" />
                    <circle cx="8" cy="16" r="0.7" fill="#FFFFFF" opacity="0.6" />
                  </pattern>
                </defs>

                {/* Base Nail Polish Body Path matching selected Shape */}
                <path
                  d={
                    shape === "Square"
                      ? "M30 140 C30 110 32 70 30 20 L70 20 C68 70 70 110 70 140 C70 148 30 148 30 140 Z"
                      : shape === "Coffin"
                      ? "M30 140 C30 110 32 70 36 20 L64 20 C68 70 70 110 70 140 C70 148 30 148 30 140 Z"
                      : shape === "Stiletto"
                      ? "M30 140 C30 110 32 70 50 15 C50 15 50 15 50 15 L50 15 C50 15 68 70 70 140 C70 148 30 148 30 140 Z"
                      : shape === "Oval"
                      ? "M30 140 C30 110 32 60 30 30 C30 15 70 15 70 30 C68 60 70 110 70 140 C70 148 30 148 30 140 Z"
                      : "M30 140 C30 110 32 65 30 35 C28 20 50 10 50 10 C50 10 72 20 70 35 C68 65 70 110 70 140 C70 148 30 148 30 140 Z" // Almond default
                  }
                  fill="url(#polishGrad)"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />

                {/* Decoration Layers */}
                {decor === "French" && (
                  <path
                    d={
                      shape === "Square"
                        ? "M30 35 L30 20 L70 20 L70 35 C55 38 45 38 30 35 Z"
                        : shape === "Coffin"
                        ? "M36 32 L36 20 L64 20 L64 32 C55 34 45 34 36 32 Z"
                        : shape === "Stiletto"
                        ? "M42 37 L50 15 L58 37 C54 39 46 39 42 37 Z"
                        : shape === "Oval"
                        ? "M30 40 C32 25 68 25 70 40 C65 32 35 32 30 40 Z"
                        : "M32 42 C35 28 65 28 68 42 C62 33 38 33 32 42 Z" // Almond French
                    }
                    fill="#FFFFFF"
                  />
                )}

                {decor === "Glitter" && (
                  <path
                    d={
                      shape === "Square"
                        ? "M30 140 C30 110 32 70 30 20 L70 20 C68 70 70 110 70 140 C70 148 30 148 30 140 Z"
                        : shape === "Coffin"
                        ? "M30 140 C30 110 32 70 36 20 L64 20 C68 70 70 110 70 140 C70 148 30 148 30 140 Z"
                        : shape === "Stiletto"
                        ? "M30 140 C30 110 32 70 50 15 L70 140 C70 148 30 148 30 140 Z"
                        : shape === "Oval"
                        ? "M30 140 C30 110 32 60 30 30 C30 15 70 15 70 30 C68 60 70 110 70 140 C70 148 30 148 30 140 Z"
                        : "M30 140 C30 110 32 65 30 35 C28 20 50 10 50 10 L70 35 C68 65 70 110 70 140 C70 148 30 148 30 140 Z"
                    }
                    fill="url(#glitterPattern)"
                  />
                )}

                {decor === "Lines" && (
                  <path
                    d="M32 90 L68 50 M30 120 L70 70 M50 145 L50 20"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                )}

                {/* Shading/Reflection Overlay depending on Texture */}
                {texture !== "Matte" && (
                  <path
                    d={
                      shape === "Square"
                        ? "M30 140 C30 110 32 70 30 20 C36 70 36 110 36 140 Z"
                        : shape === "Coffin"
                        ? "M30 140 C30 110 32 70 36 20 C42 70 42 110 36 140 Z"
                        : shape === "Stiletto"
                        ? "M30 140 C30 110 32 70 50 15 C45 70 45 110 36 140 Z"
                        : shape === "Oval"
                        ? "M30 140 C30 110 32 60 30 30 C35 60 35 110 36 140 Z"
                        : "M30 140 C30 110 32 65 30 35 C35 65 35 110 36 140 Z"
                    }
                    fill="url(#highlightGrad)"
                  />
                )}

                {/* Rhinestones Gem Decor */}
                {decor === "Stones" && (
                  <g fill="#E0F7FA" stroke="#B2EBF2" strokeWidth="0.5">
                    {/* Tiny gems down center */}
                    <circle cx="50" cy="130" r="3" />
                    <circle cx="50" cy="115" r="2.5" />
                    <circle cx="50" cy="102" r="2" />
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Customization Controls Right Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="border border-border/80 p-6 space-y-6">
            {/* Shape labels selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest block">
                {t("customStudio.shapeLabel")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Almond", "Oval", "Coffin", "Stiletto", "Square"].map((sh) => (
                  <button
                    key={sh}
                    onClick={() => setShape(sh)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      shape === sh
                        ? "border-luxe-rose bg-luxe-rose/10 text-luxe-rose"
                        : "border-border text-foreground hover:bg-luxe-rose/5"
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors picker */}
            <div className="space-y-3 border-t border-border/30 pt-5">
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest flex justify-between">
                <span>{t("customStudio.colorLabel")}</span>
                <span className="font-mono text-luxe-rose">{color.toUpperCase()}</span>
              </label>
              <div className="flex flex-wrap gap-2.5 items-center">
                {presets.map((pre, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setColor(pre.hex)}
                    className={`w-7 h-7 rounded-full border transition-transform ${
                      color === pre.hex ? "scale-110 ring-2 ring-luxe-rose/30" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: pre.hex }}
                    title={pre.name}
                  />
                ))}
                
                {/* HTML Color wheel uploader input */}
                <label className="w-8 h-8 rounded-full border border-dashed border-border hover:border-luxe-rose flex items-center justify-center cursor-pointer transition-colors">
                  <Palette className="w-4 h-4 text-foreground/60" />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Texture select */}
            <div className="space-y-3 border-t border-border/30 pt-5">
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest block">
                {t("customStudio.textureLabel")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "Glossy", label: t("customStudio.glossy") },
                  { id: "Matte", label: t("customStudio.matte") },
                  { id: "Glitter", label: t("customStudio.glitter") },
                  { id: "Chrome", label: t("customStudio.chrome") },
                ].map((tex) => (
                  <button
                    key={tex.id}
                    onClick={() => setTexture(tex.id)}
                    className={`py-2 rounded-xl text-[10px] sm:text-xs font-semibold border transition-all ${
                      texture === tex.id
                        ? "border-luxe-rose bg-luxe-rose/10 text-luxe-rose"
                        : "border-border text-foreground hover:bg-luxe-rose/5"
                    }`}
                  >
                    {tex.label.split(" ").pop()}
                  </button>
                ))}
              </div>
            </div>

            {/* Decoration select */}
            <div className="space-y-3 border-t border-border/30 pt-5">
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest block">
                {t("customStudio.decorLabel")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "None", label: t("customStudio.decorNone") },
                  { id: "French", label: t("customStudio.decorFrench") },
                  { id: "Glitter", label: t("customStudio.decorGlitter") },
                  { id: "Stones", label: t("customStudio.decorStones") },
                  { id: "Lines", label: t("customStudio.decorLines") },
                ].map((dec) => (
                  <button
                    key={dec.id}
                    onClick={() => setDecor(dec.id)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      decor === dec.id
                        ? "border-luxe-rose bg-luxe-rose/10 text-luxe-rose"
                        : "border-border text-foreground hover:bg-luxe-rose/5"
                    }`}
                  >
                    {dec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Name Input */}
            <div className="space-y-3 border-t border-border/30 pt-5">
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest block">
                Design Identity
              </label>
              <input
                type="text"
                placeholder={t("customStudio.designNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:border-luxe-rose focus:ring-1 focus:ring-luxe-rose/25 text-sm outline-none text-foreground"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={saveDesign}
                disabled={!name.trim() || saveStatus === "saving"}
                className={`flex items-center justify-center space-x-2 w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  !name.trim()
                    ? "bg-border text-foreground/30 cursor-not-allowed"
                    : saveStatus === "success"
                    ? "bg-green-600 text-white"
                    : "bg-rose-gradient text-white shadow-xl shadow-luxe-rose/20 hover:opacity-95 cursor-pointer"
                }`}
              >
                {saveStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved to Favorites!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{t("customStudio.saveFavorite")}</span>
                  </>
                )}
              </button>

              {name.trim() && saveStatus === "success" && (
                <Link
                  href={`/book?notes=${encodeURIComponent(`Custom Design: ${name.trim()} (${shape}, ${color}, ${texture}, ${decor})`)}`}
                  className="flex items-center justify-center space-x-2 w-full py-3.5 border border-luxe-rose/40 hover:border-luxe-rose rounded-xl font-semibold text-sm text-foreground transition-all duration-300"
                >
                  <span>Book with this Custom Set</span>
                  <ArrowRight className="w-4 h-4 text-luxe-rose" />
                </Link>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
