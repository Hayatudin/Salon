"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import { Phone, MapPin, Clock, Instagram, Send, Mail } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/80 bg-background/50 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold tracking-wider text-gold-gradient block">
              HANI LUXE
            </span>
            <p className="text-sm text-foreground/70 leading-relaxed font-sans">
              {t("home.storyText").substring(0, 140)}...
            </p>
            <div className="flex space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-border/80 text-foreground hover:text-luxe-gold hover:border-luxe-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-border/80 text-foreground hover:text-luxe-gold hover:border-luxe-gold transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@haniluxe.com"
                className="p-2 rounded-full border border-border/80 text-foreground hover:text-luxe-gold hover:border-luxe-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-foreground border-b border-border/40 pb-2">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-foreground/75 hover:text-luxe-gold transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-foreground/75 hover:text-luxe-gold transition-colors">
                  {t("nav.gallery")}
                </Link>
              </li>
              <li>
                <Link href="/try-on" className="text-foreground/75 hover:text-luxe-gold transition-colors">
                  {t("nav.tryOn")}
                </Link>
              </li>
              <li>
                <Link href="/custom-studio" className="text-foreground/75 hover:text-luxe-gold transition-colors">
                  {t("nav.customStudio")}
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-foreground/75 hover:text-luxe-gold transition-colors">
                  {t("nav.bookNow")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-foreground border-b border-border/40 pb-2">
              {t("home.hoursTitle")}
            </h3>
            <div className="space-y-2 text-sm text-foreground/70">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-luxe-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground/90">{t("home.weekdays").split(":")[0]}</p>
                  <p>{t("home.weekdays").split(":").slice(1).join(":")}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <Clock className="w-4 h-4 text-luxe-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground/90">{t("home.sunday").split(":")[0]}</p>
                  <p>{t("home.sunday").split(":").slice(1).join(":")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Map Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-foreground border-b border-border/40 pb-2">
              {t("home.contactTitle")}
            </h3>
            <div className="space-y-2.5 text-sm text-foreground/70">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-luxe-gold shrink-0" />
                <span>{t("home.address")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-luxe-gold shrink-0" />
                <span>+251 91 234 5678</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Bole+Road,+Addis+Ababa"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-luxe-gold/30 hover:border-luxe-gold/80 rounded-md text-xs font-semibold hover:bg-gold-500/5 text-foreground transition-all duration-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-luxe-gold" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center text-xs text-foreground/50 space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} Hani Luxe Studio. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-luxe-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-luxe-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
