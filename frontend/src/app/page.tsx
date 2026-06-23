"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { Calendar, Sparkles, ShieldCheck, Heart } from "lucide-react";

// 8 images matching the target design
const sampleImages = [
  {
    title: "Rose Gold Elegance",
    url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
    shape: "Almond",
  },
  {
    title: "Classic French Tips",
    url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80",
    shape: "Oval",
  },
  {
    title: "Midnight Luxe",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    shape: "Coffin",
  },
  {
    title: "Bridal Blush",
    url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=600&q=80",
    shape: "Almond",
  },
  {
    title: "Nude Minimalist",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    shape: "Oval",
  },
  {
    title: "Cherry Blossom",
    url: "https://images.unsplash.com/photo-1610992015732-2449b76e443a?auto=format&fit=crop&w=600&q=80",
    shape: "Oval",
  },
  {
    title: "Acrylic Galaxy",
    url: "https://images.unsplash.com/photo-1632345031435-8797b2d58045?auto=format&fit=crop&w=600&q=80",
    shape: "Stiletto",
  },
  {
    title: "Gel Ombre Sunset",
    url: "https://images.unsplash.com/photo-1560869713-7d0a294308ee?auto=format&fit=crop&w=600&q=80",
    shape: "Square",
  },
];

export default function Home() {
  const { t } = useLanguage();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-24 pb-12 w-full">
      {/* 1. HERO SECTION - Full-Width Full-Screen Liquid Glass Background */}
      <section className="relative overflow-hidden rounded-3xl min-h-[640px] flex items-center justify-center p-6 sm:p-12 md:p-20 text-center w-full bg-luxe-dark-burgundy">
        {/* Background Image of hand - full screen within container */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-lighten"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200')`,
            filter: "brightness(0.5) contrast(1.1)"
          }}
        ></div>

        {/* Liquid dark-burgundy gradient layering */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-luxe-dark-burgundy/40 via-luxe-dark-burgundy/85 to-luxe-dark-burgundy"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 w-full">
          {/* Top Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-luxe-rose uppercase"
          >
            <Sparkles className="w-3 h-3" />
            <span>Premium Nail Salon & Spa</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif leading-tight text-white tracking-wide"
          >
            Beautiful Nails, <br />
            <span className="text-rose-gradient">Confident You</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-rose-100/70 max-w-xl mx-auto leading-relaxed"
          >
            {t("home.heroSubtitle")}
          </motion.p>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/book"
              className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3.5 bg-rose-gradient text-white rounded-full font-bold text-sm shadow-lg shadow-luxe-rose/25 hover:opacity-90 transition-all duration-300 cursor-pointer"
            >
              <span>Book Appointment</span>
              <Heart className="w-4 h-4 fill-white" />
            </Link>

            <Link
              href="/gallery"
              className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-full font-bold text-sm transition-all duration-300 cursor-pointer"
            >
              <span>Explore Designs</span>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/5 mt-10"
          >
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-white">1000+</p>
              <p className="text-[10px] sm:text-xs text-rose-200/50 uppercase tracking-widest mt-1">Happy Clients</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-white">98+%</p>
              <p className="text-[10px] sm:text-xs text-rose-200/50 uppercase tracking-widest mt-1">Satisfaction</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-white">50+</p>
              <p className="text-[10px] sm:text-xs text-rose-200/50 uppercase tracking-widest mt-1">Nail Artists</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-white">5+</p>
              <p className="text-[10px] sm:text-xs text-rose-200/50 uppercase tracking-widest mt-1">Years Experience</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION - White Card Layout matching the mockup */}
      <section className="space-y-12 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Our Services
          </h2>
          <p className="text-sm text-foreground/70 max-w-xl mx-auto">
            Experience luxury nail care with our expert artists
          </p>
        </div>

        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-center w-full"
        >
          {/* Target UI layout - clean white rounded container */}
          <div className="relative overflow-hidden rounded-3xl bg-white/95 p-8 md:p-12 shadow-2xl flex flex-col items-center justify-between min-h-[380px] w-full max-w-[760px] text-center border-none">
            
            {/* Header elements inside card */}
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-rose">
                Expert Nail Care
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-luxe-burgundy leading-snug">
                Precision & Beauty in Every Service
              </h3>
            </div>

            {/* Central Graphic / Hands polished showcase */}
            <div className="relative w-full max-w-[480px] h-[160px] sm:h-[200px] my-6 z-10 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1632345031435-8797b2d58045?auto=format&fit=crop&w=600&q=80"
                alt="Nail polishing hands"
                fill
                className="object-contain rounded-2xl"
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>

            {/* Corner badge elements placed at bottom left & right inside card */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-luxe-burgundy/5 z-10">
              {/* Left Badge: Hygiene (Pink background) */}
              <div className="flex items-center space-x-3 bg-luxe-rose text-white rounded-2xl px-5 py-3 w-full sm:w-auto text-left shadow-md">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-100">Hygiene First</p>
                  <p className="text-[9px] font-semibold opacity-90 whitespace-nowrap">100% Sterilized Equipment</p>
                </div>
              </div>

              {/* Right Badge: Premium Quality (Cream/White background) */}
              <div className="flex items-center space-x-3 bg-luxe-burgundy text-white rounded-2xl px-5 py-3 w-full sm:w-auto text-left shadow-md">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-200">Premium Quality</p>
                  <p className="text-[9px] font-semibold opacity-90 whitespace-nowrap">Top Brands & Products</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. GALLERY SECTION - Borderless Image Grid */}
      <section className="space-y-12 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Our Gallery
          </h2>
          <p className="text-sm text-foreground/70 max-w-xl mx-auto">
            Browse through our collection of exquisite nail designs
          </p>
        </div>

        {/* 8-Grid of clean, borderless images with rounded corners */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          {sampleImages.map((design, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-lg border-none"
            >
              {/* Borderless Image */}
              <Image
                src={design.url}
                alt={design.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              
              {/* Flat dark vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxe-dark-burgundy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Minimalist style title text at bottom on hover */}
              <div className="absolute bottom-3 left-3 right-3 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
                <span className="text-[8px] uppercase tracking-widest font-bold text-luxe-rose">
                  {design.shape} shape
                </span>
                <h4 className="text-xs font-serif font-semibold leading-tight mt-0.5">
                  {design.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-transparent hover:bg-white/5 border border-luxe-rose/20 hover:border-luxe-rose rounded-full text-xs font-semibold text-foreground transition-all duration-300 cursor-pointer"
          >
            <span>Explore All Designs</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
