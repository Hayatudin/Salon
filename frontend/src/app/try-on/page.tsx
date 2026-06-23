"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { nailDesigns, NailDesign } from "../../data/designs";
import { Upload, RotateCw, Move, Check, Download, AlertCircle, RefreshCw, ZoomIn } from "lucide-react";
import GlassCard from "../../components/GlassCard";

// Sample skin tone hand templates from high quality stock photography
const handTemplates = [
  { id: "light", name: "Fair Tone", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80" },
  { id: "medium", name: "Warm Tone", url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80" },
  { id: "dark", name: "Deep Tone", url: "https://images.unsplash.com/photo-1560869713-7d0a294308ee?auto=format&fit=crop&w=400&q=80" },
];

export default function TryOn() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // States
  const [selectedDesign, setSelectedDesign] = useState<NailDesign>(nailDesigns[0]);
  const [handImage, setHandImage] = useState<string>(handTemplates[0].url);
  const [nailShape, setNailShape] = useState<string>("Almond");
  const [nailLength, setNailLength] = useState<number>(30); // in pixels
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0); // in degrees
  const [offsetX, setOffsetX] = useState<number>(0); // alignment shift
  const [offsetY, setOffsetY] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(0.85); // realism blend
  const [isLoading, setIsLoading] = useState(false);

  // Trigger canvas repaint when parameters change
  useEffect(() => {
    repaintCanvas();
  }, [selectedDesign, handImage, nailShape, nailLength, scale, rotation, offsetX, offsetY, opacity]);

  const repaintCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load hand background image
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = handImage;
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw hand base to fill canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw nail overlays
      drawNails(ctx);
    };
  };

  // Logic to draw nail vector overlays on canvas
  const drawNails = (ctx: CanvasRenderingContext2D) => {
    // Standard hand layout coordinates for templates (Thumb, Index, Middle, Ring, Pinky)
    const baseFingers = [
      { x: 100, y: 250, angle: -15, width: 22 }, // Thumb
      { x: 165, y: 155, angle: -5, width: 17 },  // Index
      { x: 225, y: 140, angle: 2, width: 18 },   // Middle
      { x: 285, y: 150, angle: 8, width: 17 },   // Ring
      { x: 340, y: 200, angle: 18, width: 14 },  // Pinky
    ];

    ctx.save();
    
    // Apply global blending offsets
    ctx.translate(offsetX, offsetY);

    baseFingers.forEach((finger) => {
      ctx.save();
      
      // Translate to finger coordinate, apply sizing/rotation adjustments
      ctx.translate(finger.x, finger.y);
      ctx.rotate((finger.angle + rotation) * Math.PI / 180);
      ctx.scale(scale, scale);

      // Define nail path parameters
      const w = finger.width / 2;
      const len = nailLength;

      ctx.beginPath();
      ctx.moveTo(-w, 0); // start bottom left

      // Draw custom nail shapes
      if (nailShape === "Square") {
        ctx.lineTo(-w, -len);
        ctx.lineTo(w, -len);
        ctx.lineTo(w, 0);
      } else if (nailShape === "Coffin") {
        ctx.lineTo(-w * 0.75, -len);
        ctx.lineTo(w * 0.75, -len);
        ctx.lineTo(w, 0);
      } else if (nailShape === "Stiletto") {
        ctx.lineTo(0, -len * 1.15); // sharp tip
        ctx.lineTo(w, 0);
      } else if (nailShape === "Almond") {
        ctx.bezierCurveTo(-w, -len * 0.5, -w * 0.3, -len * 1.05, 0, -len * 1.05); // tapered curves
        ctx.bezierCurveTo(w * 0.3, -len * 1.05, w, -len * 0.5, w, 0);
      } else { // Oval
        ctx.bezierCurveTo(-w, -len * 0.8, -w * 0.8, -len, 0, -len);
        ctx.bezierCurveTo(w * 0.8, -len, w, -len * 0.8, w, 0);
      }

      ctx.bezierCurveTo(w, w * 0.5, -w, w * 0.5, -w, 0); // bottom rounded cuticle
      ctx.closePath();

      // Fill style colors
      ctx.globalAlpha = opacity;
      
      // Base coat color mapping
      const baseColor = selectedDesign.colors[0];
      const accentColor = selectedDesign.colors[1] || selectedDesign.colors[0];
      
      const gradient = ctx.createLinearGradient(0, 0, 0, -len);
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, accentColor);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw standard nail shine overlay
      ctx.globalAlpha = opacity * 0.3;
      ctx.beginPath();
      ctx.moveTo(-w * 0.4, 0);
      ctx.bezierCurveTo(-w * 0.4, -len * 0.5, -w * 0.1, -len * 0.9, 0, -len * 0.9);
      ctx.lineTo(-w * 0.1, -len * 0.9);
      ctx.bezierCurveTo(-w * 0.5, -len * 0.5, -w * 0.5, 0, -w * 0.5, 0);
      ctx.closePath();
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      // Glitter particles if design type is Acrylic/Glitter
      if (selectedDesign.tags.includes("Glitter") || selectedDesign.id.includes("galaxy")) {
        ctx.globalAlpha = opacity * 0.5;
        ctx.fillStyle = "#FFFFFF";
        for (let i = 0; i < 6; i++) {
          const gx = (Math.random() - 0.5) * w * 1.5;
          const gy = -Math.random() * len;
          ctx.fillRect(gx, gy, 2, 2);
        }
      }

      // French Tips if design type is French
      if (selectedDesign.type === "French") {
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(0, -len + 2, w * 0.8, 0, Math.PI, true);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  };

  // Image Upload handler
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setHandImage(uploadEvent.target.result as string);
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Download resulting layout composition
  const downloadResult = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `tryon_${selectedDesign.id}_${nailShape.toLowerCase()}.png`;
    link.href = dataURL;
    link.click();
  };

  // Reset overlay offsets
  const resetSettings = () => {
    setScale(1.0);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
    setNailLength(30);
    setOpacity(0.85);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-wide">
          {t("tryOn.title")}
        </h1>
        <p className="text-sm sm:text-base text-foreground/75 max-w-xl mx-auto leading-relaxed">
          {t("tryOn.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* Canvas & Workspace Left Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-luxe-dark-burgundy/40 w-full max-w-[450px] aspect-[4/5] flex items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center text-white">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            )}
            
            {/* HTML5 Composition Canvas */}
            <canvas
              ref={canvasRef}
              width={400}
              height={500}
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-xs text-foreground/50 text-center flex items-center">
            <AlertCircle className="w-4 h-4 mr-1 text-luxe-rose" />
            {t("tryOn.dragPrompt")}
          </p>

          {/* Skin Tone Presets row */}
          <div className="flex space-x-3 pt-2">
            {handTemplates.map((temp) => (
              <button
                key={temp.id}
                onClick={() => setHandImage(temp.url)}
                className={`flex flex-col items-center space-y-1.5 p-2 rounded-xl border transition-colors ${
                  handImage === temp.url ? "border-luxe-rose bg-luxe-rose/10" : "border-border hover:bg-luxe-rose/5"
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                  <Image src={temp.url} alt={temp.name} fill className="object-cover" sizes="48px" />
                </div>
                <span className="text-[10px] font-bold text-foreground/70">{temp.name}</span>
              </button>
            ))}

            {/* Custom Upload Button */}
            <label className="flex flex-col items-center justify-center p-2 w-[74px] h-[78px] rounded-xl border border-dashed border-border hover:border-luxe-rose hover:bg-luxe-rose/5 cursor-pointer text-center transition-colors">
              <Upload className="w-5 h-5 text-luxe-rose mb-1" />
              <span className="text-[10px] font-bold text-foreground/70">{t("tryOn.uploadBtn").split(" ")[0]}</span>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Adjustments & Design selectors Right Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Design selection list */}
          <GlassCard className="border border-border/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-widest border-b border-border/30 pb-2">
              1. {t("tryOn.selectDesign")}
            </h3>
            
            <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-1">
              {nailDesigns.map((design) => (
                <button
                  key={design.id}
                  onClick={() => {
                    setSelectedDesign(design);
                    setNailShape(design.shape);
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                    selectedDesign.id === design.id
                      ? "border-luxe-rose ring-2 ring-luxe-rose/25 scale-95"
                      : "border-border hover:border-luxe-rose/50"
                  }`}
                  title={design.defaultName}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${design.colors[0]} 0%, ${design.colors[1] || design.colors[0]} 100%)`,
                    }}
                  />
                  {selectedDesign.id === design.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <p className="text-xs text-foreground/50">Active selection:</p>
              <p className="text-sm font-bold text-luxe-rose mt-0.5">{selectedDesign.defaultName}</p>
            </div>
          </GlassCard>

          {/* Adjustments Sliders */}
          <GlassCard className="border border-border/80 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/30 pb-2">
              <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-widest">
                2. {t("tryOn.adjustNails")}
              </h3>
              <button
                onClick={resetSettings}
                className="text-[10px] font-bold text-luxe-rose uppercase hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Shape Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/70 flex justify-between">
                <span>Nail Shape</span>
                <span className="font-bold text-luxe-rose">{nailShape}</span>
              </label>
              <select
                value={nailShape}
                onChange={(e) => setNailShape(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground"
              >
                <option value="Almond">Almond (Oval Tapered)</option>
                <option value="Oval">Oval (Rounded)</option>
                <option value="Coffin">Coffin (Flat Tip)</option>
                <option value="Stiletto">Stiletto (Pointed)</option>
                <option value="Square">Square (Flat Sides)</option>
              </select>
            </div>

            {/* Scale Slider */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/70 flex justify-between">
                <span className="flex items-center"><ZoomIn className="w-3.5 h-3.5 mr-1" /> {t("tryOn.scale")}</span>
                <span className="font-mono text-xs">{scale.toFixed(2)}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-luxe-rose bg-border h-1 rounded-lg outline-none"
              />
            </div>

            {/* Rotation Slider */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/70 flex justify-between">
                <span className="flex items-center"><RotateCw className="w-3.5 h-3.5 mr-1" /> {t("tryOn.rotate")}</span>
                <span className="font-mono text-xs">{rotation}°</span>
              </label>
              <input
                type="range"
                min="-45"
                max="45"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full accent-luxe-rose bg-border h-1 rounded-lg outline-none"
              />
            </div>

            {/* Length Slider */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/70 flex justify-between">
                <span>{t("tryOn.length")}</span>
                <span className="font-mono text-xs">{nailLength}px</span>
              </label>
              <input
                type="range"
                min="15"
                max="60"
                value={nailLength}
                onChange={(e) => setNailLength(parseInt(e.target.value))}
                className="w-full accent-luxe-rose bg-border h-1 rounded-lg outline-none"
              />
            </div>

            {/* Translation Offsets */}
            <div className="space-y-2 border-t border-border/30 pt-4">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest flex items-center">
                <Move className="w-3.5 h-3.5 mr-1" /> Position Offset (X / Y)
              </span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-foreground/50">Horizontal Shift</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    className="w-full accent-luxe-rose bg-border h-1 rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-foreground/50">Vertical Shift</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value))}
                    className="w-full accent-luxe-rose bg-border h-1 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Transparency Blend */}
            <div className="space-y-1.5 border-t border-border/30 pt-4">
              <label className="text-xs font-semibold text-foreground/70 flex justify-between">
                <span>{t("tryOn.blendMode")}</span>
                <span className="font-mono text-xs">{Math.round(opacity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-luxe-rose bg-border h-1 rounded-lg outline-none"
              />
            </div>
          </GlassCard>

          {/* Action buttons */}
          <div className="pt-2">
            <button
              onClick={downloadResult}
              className="flex items-center justify-center space-x-2 w-full py-4 bg-rose-gradient text-white rounded-2xl font-bold text-base shadow-xl shadow-luxe-rose/20 hover:opacity-95 transition-opacity"
            >
              <Download className="w-5 h-5" />
              <span>{t("tryOn.downloadBtn")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
