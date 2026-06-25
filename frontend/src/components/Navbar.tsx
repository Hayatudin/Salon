"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Sun, Moon, Home, Image as ImageIcon, Sparkles, Paintbrush, Calendar, User, Sparkle } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  
  // Hide client navbar inside admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for theme state
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/gallery", label: t("nav.gallery"), icon: ImageIcon },
    { href: "/try-on", label: t("nav.tryOn"), icon: Sparkles },
    { href: "/book", label: t("nav.bookNow"), icon: Calendar },
    { href: "/auth", label: t("nav.login"), icon: User },
  ];

  return (
    <>
      {/* Floating Top-Right Utilities Widget (Languages & Theme Toggler) */}
      <div className="fixed top-6 right-6 flex items-center space-x-3 z-50">
        {/* Language Toggler */}
        <button
          onClick={() => setLocale(locale === "en" ? "am" : "en")}
          className="px-3 py-1.5 text-xs font-bold tracking-wider rounded-full glass-effect hover:bg-luxe-rose/10 text-foreground transition-all duration-300"
        >
          {locale === "en" ? "አማርኛ" : "English"}
        </button>

        {/* Theme Toggler */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full glass-effect text-foreground hover:text-luxe-rose transition-all duration-300 cursor-pointer"
          aria-label="Toggle Theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-4 h-4 text-yellow-400" />
          ) : (
            <Moon className="w-4 h-4 text-luxe-burgundy dark:text-rose-200" />
          )}
        </button>
      </div>

      {/* DESKTOP SIDEBAR - Floating Left Panel */}
      <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 w-20 py-8 rounded-3xl z-40 glass-effect flex-col items-center justify-between min-h-[500px] shadow-2xl">
        {/* Brand Icon / Logo */}
        <Link href="/" className="mb-8 hover:scale-110 transition-transform duration-300">
          <div className="w-12 h-12 rounded-2xl bg-rose-gradient flex items-center justify-center shadow-lg shadow-luxe-rose/25">
            <Sparkle className="w-6 h-6 text-white" />
          </div>
        </Link>

        {/* Navigation Icons Link Grid */}
        <div className="flex flex-col space-y-4 flex-grow justify-center">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "text-white bg-rose-gradient shadow-md shadow-luxe-rose/20 scale-105"
                      : "text-foreground/70 hover:text-luxe-rose hover:bg-luxe-rose/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
                
                {/* Tooltip on Hover */}
                <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-md text-xs font-semibold bg-luxe-burgundy text-white border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                  {link.label}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM BAR - Floating Bottom Panel */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 h-16 rounded-2xl z-40 glass-effect shadow-xl flex items-center justify-start overflow-x-auto gap-2 px-3 py-2 scrollbar-none sm:justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 shrink-0 ${
                isActive
                  ? "text-white bg-rose-gradient shadow-md shadow-luxe-rose/15 scale-105"
                  : "text-foreground/75 hover:text-luxe-rose hover:bg-luxe-rose/5"
              }`}
              aria-label={link.label}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
