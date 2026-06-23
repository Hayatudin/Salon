import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hani Luxe Studio | Premium Nails & Spa",
  description: "Experience beauty at its finest with Hani Luxe Studio. Featuring interactive AI beauty assistants, virtual try-ons, custom nail designs, and a luxury booking environment.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen lg:flex-row">
              {/* Navbar holds the left sidebar on desktop & bottom bar on mobile */}
              <Navbar />
              
              {/* Main Content Area: Offset for Left Sidebar on desktop and Bottom Nav on mobile */}
              <div className="flex-grow flex flex-col min-h-screen lg:pl-32 pb-24 lg:pb-0">
                <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
