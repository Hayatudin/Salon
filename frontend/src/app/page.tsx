// Hani Luxe Studio - Premium Nail Salon
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { dynamicDesignService } from "../services/designs";
import { NailDesign } from "../data/designs";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Star, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Paintbrush,
  Sparkle,
  Camera
} from "lucide-react";
import GlassCard from "../components/GlassCard";

// 8 featured designs matching the target designs
const sampleImages = [
  {
    id: "rose-gold-elegance",
    title: "Rose Gold Elegance",
    amTitle: "ሮዝ ጎልድ ቅንጦት",
    url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
    shape: "Almond",
    amShape: "አልመንድ",
  },
  {
    id: "classic-french-tips",
    title: "Classic French Tips",
    amTitle: "ክላሲክ ፈረንሳይ ቲፕስ",
    url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80",
    shape: "Oval",
    amShape: "ኦቫል",
  },
  {
    id: "midnight-luxe",
    title: "Midnight Luxe",
    amTitle: "የእኩለ ሌሊት ሉክስ",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    shape: "Coffin",
    amShape: "ኮፊን",
  },
  {
    id: "bridal-blush",
    title: "Bridal Blush",
    amTitle: "የሙሽራ ብሉሽ",
    url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=600&q=80",
    shape: "Almond",
    amShape: "አልመንድ",
  },
  {
    id: "nude-minimalist",
    title: "Nude Minimalist",
    amTitle: "ኑድ ሚኒማሊስት",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    shape: "Oval",
    amShape: "ኦቫል",
  },
  {
    id: "cherry-blossom",
    title: "Cherry Blossom",
    amTitle: "ቼሪ ብሎሰም",
    url: "https://images.unsplash.com/photo-1610992015732-2449b76e443a?auto=format&fit=crop&w=600&q=80",
    shape: "Oval",
    amShape: "ኦቫል",
  },
  {
    id: "acrylic-galaxy",
    title: "Acrylic Galaxy",
    amTitle: "አክሬሊክስ ጋላክሲ",
    url: "https://images.unsplash.com/photo-1632345031435-8797b2d58045?auto=format&fit=crop&w=600&q=80",
    shape: "Stiletto",
    amShape: "ስቲሌቶ",
  },
  {
    id: "gel-ombre-sunset",
    title: "Gel Ombre Sunset",
    amTitle: "ጄል ኦምብሬ ሰንሴት",
    url: "https://images.unsplash.com/photo-1560869713-7d0a294308ee?auto=format&fit=crop&w=600&q=80",
    shape: "Square",
    amShape: "ስኩዌር",
  },
];

// 5 collections mapping to the styles/shapes
const collections = [
  { name: "Almond", amName: "አልመንድ", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80" },
  { name: "Oval", amName: "ኦቫል", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80" },
  { name: "Coffin", amName: "ኮፊን", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
  { name: "Square", amName: "ስኩዌር", image: "https://images.unsplash.com/photo-1560869713-7d0a294308ee?auto=format&fit=crop&w=600&q=80" },
  { name: "Stiletto", amName: "ስቲሌቶ", image: "https://images.unsplash.com/photo-1632345031435-8797b2d58045?auto=format&fit=crop&w=600&q=80" },
];

export default function Home() {
  const { t, locale } = useLanguage();

  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);

  useEffect(() => {
    // 1. Load designs dynamically
    dynamicDesignService.getDesigns().then((activeDesigns) => {
      setDesigns(activeDesigns.slice(0, 8));
    });

    // 2. Load collections dynamically from database
    dynamicDesignService.getCollections().then((loadedColls) => {
      setShapes(loadedColls.map((c) => ({
        name: c.name,
        amName: c.name === "Almond" ? "አልመንድ" : c.name === "Oval" ? "ኦቫል" : c.name === "Coffin" ? "ኮፊን" : c.name === "Square" ? "ስኩዌር" : c.name === "Stiletto" ? "ስቲሌቶ" : c.name,
        image: c.image
      })));
    });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
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
    <div className="pb-16 w-full">
      {/* 1. HERO SECTION - Full-Width Full-Screen Edge-to-Edge Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center p-6 sm:p-12 md:p-20 text-center w-full bg-luxe-dark-burgundy">
        {/* Background Image of hand - full screen, covers viewport */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-95 mix-blend-normal"
          style={{ 
            backgroundImage: "url('/hero_img.png')",
          }}
        ></div>

        {/* Liquid dark-burgundy gradient overlay - darker at top and bottom, current color at center */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1c000c]/90 via-[#590624]/30 to-[#1c000c]/95"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 w-full">
          {/* Top Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] sm:text-xs font-bold tracking-widest text-luxe-rose uppercase"
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span>{t("home.premiumNailStudio")}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif leading-tight text-white tracking-wide"
          >
            {t("home.whereBeauty")} <br />
            <span className="text-rose-gradient">{t("home.meetsArt")}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-rose-100/75 max-w-2xl mx-auto leading-relaxed"
          >
            {t("home.heroDesc")}
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/book"
              className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3.5 bg-rose-gradient text-white rounded-full font-bold text-sm shadow-lg shadow-luxe-rose/25 hover:opacity-90 transition-all duration-300 cursor-pointer"
            >
              <span>{t("home.bookAppointment")}</span>
              <Heart className="w-4 h-4 fill-white" />
            </Link>

            <Link
              href="/try-on"
              className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-full font-bold text-sm transition-all duration-300 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Try-on Now</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Container for sections below Hero - padded on desktop to accommodate the sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-32 space-y-32 py-24 w-full">
        
        {/* 1.5. AI HAND SCANNER SHOWCASE SECTION */}
        <section className="space-y-8 w-full max-w-5xl mx-auto text-center">
          {/* Section Header */}
          <div className="space-y-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-luxe-rose">
              AI Technology
            </span>
            
            <p className="text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              {t("home.aiScannerShortDesc")}
            </p>
          </div>

          {/* Centered Image Card with soft backdrop glow */}
          <div className="relative flex justify-center w-full">
            {/* Soft pink glow behind image */}
            <div className="absolute inset-0 bg-luxe-rose/10 blur-[120px] rounded-full -z-10 w-2/3 h-3/4 mx-auto"></div>

            <Link 
              href="/try-on" 
              className="block w-full relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-black/40 transition-shadow duration-300 cursor-pointer border-none"
            >
              <Image
                src="/captures.png"
                alt="AI Hand Scanner Snap & Style"
                width={1400}
                height={700}
                className="w-full h-auto object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </Link>
          </div>
        </section>

        {/* 2. FEATURED DESIGNS SECTION (Trending Now) */}
        <section className="space-y-12 w-full">
          <div className="text-center space-y-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-luxe-rose">
              {t("home.trendingNow")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {t("home.featuredDesigns")}
            </h2>
            <div className="w-16 h-1 bg-rose-gradient mx-auto rounded-full mt-2"></div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            {designs.map((design, index) => (
              <motion.div
                key={design.id}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-lg bg-luxe-dark-burgundy"
              >
                <Image
                  src={design.image}
                  alt={locale === "en" ? design.defaultName : (design.nameKey ? t("designs." + design.nameKey) : design.defaultName)}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized={design.image.startsWith("/uploads")}
                />
                
                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c000c]/90 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Details on Hover */}
                <div className="absolute bottom-4 left-4 right-4 text-white z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 text-left">
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-luxe-rose">
                    {locale === "en" ? design.shape : design.shape} {locale === "en" ? "Shape" : "ቅርፅ"}
                  </span>
                  <h4 className="text-xs sm:text-sm font-serif font-bold leading-tight mt-0.5">
                    {locale === "en" ? design.defaultName : (design.nameKey ? t("designs." + design.nameKey) : design.defaultName)}
                  </h4>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center pt-4">
            <Link
              href="/gallery"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-transparent hover:bg-white/5 border border-luxe-rose/20 hover:border-luxe-rose rounded-full text-xs font-semibold text-foreground transition-all duration-300 cursor-pointer"
            >
              <span>{t("home.viewAllDesigns")}</span>
            </Link>
          </div>
        </section>

        {/* 3. COLLECTIONS SECTION (Browse by Style) */}
        <section className="space-y-12 w-full">
          <div className="text-center space-y-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-luxe-rose">
              {t("home.collections")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {t("home.browseByStyle")}
            </h2>
            <div className="w-16 h-1 bg-rose-gradient mx-auto rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full">
            {shapes.map((coll, index) => (
              <Link 
                href={`/gallery?shape=${coll.name}`} 
                key={coll.name}
                className="group flex flex-col items-center space-y-4"
              >
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
                  <Image 
                    src={coll.image}
                    alt={locale === "en" ? coll.name : coll.amName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-[#1c000c]/30 group-hover:bg-[#1c000c]/10 transition-colors duration-300"></div>
                </div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-foreground group-hover:text-luxe-rose transition-colors duration-300">
                  {locale === "en" ? coll.name : coll.amName}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. OUR STORY SECTION */}
        <section className="space-y-12 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Text */}
            <div className="space-y-6 text-left">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-luxe-rose block">
                {t("home.ourStory")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground leading-snug">
                {t("home.artistryInEvery")}<br />
                <span className="text-rose-gradient">{t("home.detail")}</span>
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-foreground/75 leading-relaxed font-light">
                <p>{t("home.aboutP1")}</p>
                <p>{t("home.aboutP2")}</p>
              </div>
            </div>

            {/* Collage Panel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg relative bg-luxe-dark-burgundy">
                  <Image 
                    src="https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=400&q=80"
                    alt="Luxury nail art"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg relative bg-luxe-dark-burgundy">
                  <Image 
                    src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&q=80"
                    alt="Luxe salon environment"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 w-full">
            {[
              { value: "5+", labelKey: "home.yearsExperience" },
              { value: "1,000+", labelKey: "home.happyClients" },
              { value: "150+", labelKey: "home.nailDesigns" },
              { value: "2,500+", labelKey: "home.hoursOfArt" },
            ].map((stat, i) => (
              <GlassCard 
                key={stat.labelKey}
                className="p-6 text-center space-y-2 border-none shadow-md"
              >
                <h4 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                  {stat.value}
                </h4>
                <p className="text-[10px] sm:text-xs text-foreground/50 uppercase tracking-widest font-semibold">
                  {t(stat.labelKey)}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* 5. TESTIMONIALS SECTION */}
        <section className="space-y-12 w-full">
          <div className="text-center space-y-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-luxe-rose">
              {t("home.testimonials")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {t("home.whatOurClientsSay")}
            </h2>
            <div className="w-16 h-1 bg-rose-gradient mx-auto rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                id: "1",
                customer_name: "Sara M.",
                rating: 5,
                text: "Absolutely love my nails! The attention to detail is incredible. Best salon in the city!",
                amText: "ጥፍሮቼን በጣም ወድጄዋቸዋለሁ! ለዝርዝር ነገሮች የሚሰጠው ትኩረት የሚደነቅ ነው። በከተማው ውስጥ ምርጡ ስቱዲዮ ነው!"
              },
              {
                id: "2",
                customer_name: "Hanna T.",
                rating: 5,
                text: "My bridal nails were perfect. The team understood exactly what I wanted. Highly recommend!",
                amText: "ለሰርጌ የተሰራው ጥፍር ፍጹም ነበር። ቡድኑ በትክክል የምፈልገውን ተረድቶልኛል። በጣም እመክራለሁ!"
              },
              {
                id: "3",
                customer_name: "Liya K.",
                rating: 5,
                text: "I always come here for special occasions. The designs are unique and the quality is outstanding.",
                amText: "ለልዩ ዝግጅቶች ሁልጊዜ እዚህ ነው የምመጣው። ዲዛይኖቹ ልዩ ናቸው፣ ጥራቱም እጅግ አስደናቂ ነው!"
              }
            ].map((rev) => (
              <GlassCard 
                key={rev.id}
                className="p-8 text-left space-y-6 flex flex-col justify-between border-none shadow-md relative"
              >
                {/* 5 Stars */}
                <div className="flex space-x-1">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-luxe-rose text-luxe-rose" />
                  ))}
                </div>

                <p className="text-sm text-foreground/80 italic leading-relaxed">
                  &ldquo;{locale === "en" ? rev.text : rev.amText}&rdquo;
                </p>

                <div className="border-t border-border pt-4">
                  <p className="text-xs sm:text-sm font-serif font-bold text-foreground">
                    {rev.customer_name}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* 6. CONTACT & VISIT SECTION */}
        <section className="space-y-12 w-full">
          <div className="text-center space-y-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-luxe-rose">
              {t("home.getInTouch")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {t("home.visitOurStudio")}
            </h2>
            <div className="w-16 h-1 bg-rose-gradient mx-auto rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            {/* Contact details cards */}
            <div className="flex flex-col justify-between space-y-6">
              
              {/* Location Card */}
              <GlassCard className="p-6 flex items-start space-x-4 border-none shadow-md text-left">
                <div className="w-10 h-10 rounded-full bg-luxe-rose/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-luxe-rose" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-luxe-rose">
                    {t("home.location")}
                  </h4>
                  <p className="text-sm text-foreground/80 leading-normal">
                    {t("home.address")}
                  </p>
                  <a
                    href="https://maps.google.com/?q=Bole+Road,+Addis+Ababa"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-luxe-rose hover:underline pt-1"
                  >
                    <span>Get Directions</span>
                  </a>
                </div>
              </GlassCard>

              {/* Phone Card */}
              <GlassCard className="p-6 flex items-start space-x-4 border-none shadow-md text-left">
                <div className="w-10 h-10 rounded-full bg-luxe-rose/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-luxe-rose" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-luxe-rose">
                    {t("home.phone")}
                  </h4>
                  <a 
                    href="tel:+251912345678" 
                    className="text-sm text-foreground/80 hover:text-luxe-rose transition-colors block font-semibold"
                  >
                    +251 91 234 5678
                  </a>
                </div>
              </GlassCard>

              {/* Hours Card */}
              <GlassCard className="p-6 flex items-start space-x-4 border-none shadow-md text-left">
                <div className="w-10 h-10 rounded-full bg-luxe-rose/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-luxe-rose" />
                </div>
                <div className="space-y-2 w-full">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-luxe-rose">
                    {t("home.businessHours")}
                  </h4>
                    <div className="text-sm text-foreground/80 space-y-2.5 w-full">
                      <div className="flex justify-between">
                        <span className="font-medium">{t("home.monFriLabel")}</span>
                        <span>9:00 AM – 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t("home.saturdayLabel")}</span>
                        <span>9:00 AM – 7:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-foreground/45">{t("home.sundayLabel")}</span>
                        <span className="text-foreground/45 italic">{t("home.closedLabel")}</span>
                      </div>
                    </div>
                </div>
              </GlassCard>

              {/* Chat on WhatsApp */}
              <a
                href="https://wa.me/251912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm shadow-md transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 fill-white text-green-600" />
                <span>{t("home.chatOnWhatsApp")}</span>
              </a>

            </div>

            {/* Embedded Google Map */}
            <div className="rounded-3xl overflow-hidden min-h-[350px] shadow-lg relative bg-luxe-dark-burgundy">
              <iframe
                title="Hani Luxe Studio Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.548231267864!2d38.7834562!3d8.9954321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab5a11%3A0x600109a1df2ff456!2sBole%20Rd%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
                className="absolute inset-0 w-full h-full border-none"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
