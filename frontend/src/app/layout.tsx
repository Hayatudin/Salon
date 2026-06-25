import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
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
      className={`${roboto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <div className="relative min-h-screen flex flex-col">
              {/* Navbar holds the left sidebar on desktop & bottom bar on mobile */}
              <Navbar />
              
              {/* Main Content Area: Content spans 100% width and navbar overlays it */}
              <div className="flex-grow flex flex-col min-h-screen pb-24 lg:pb-0">
                <main className="flex-grow w-full">
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
