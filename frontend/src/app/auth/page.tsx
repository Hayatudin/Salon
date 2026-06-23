"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { Lock, Mail, ChevronRight, AlertCircle, ArrowLeft } from "lucide-react";
import GlassCard from "../../components/GlassCard";

export default function Auth() {
  const { t } = useLanguage();
  const router = useRouter();

  // Mode: Sign In or Sign Up
  const [isLogin, setIsLogin] = useState(true);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Mock Authentication Delay
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("luxe_user", JSON.stringify({ email }));
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
          </h1>
          <p className="text-sm text-foreground/75 leading-relaxed">
            {isLogin ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}
          </p>
        </div>

        {/* Auth Box Panel */}
        <GlassCard className="border border-border/80 p-8 shadow-2xl relative bg-card text-foreground">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Display error */}
            {error && (
              <div className="flex items-center space-x-2 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1 text-luxe-rose" />
                {t("auth.emailLabel")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1 text-luxe-rose" />
                {t("auth.passwordLabel")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground"
              />
            </div>

            {/* Confirm Password Field (Registration Mode only) */}
            {!isLogin && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-xs font-semibold text-foreground/80 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-luxe-rose" />
                  {t("auth.confirmPasswordLabel")}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground"
                />
              </div>
            )}

            {/* Submit Trigger */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 w-full py-3.5 bg-rose-gradient text-white rounded-xl font-bold text-sm shadow-xl shadow-luxe-rose/25 hover:opacity-95 transition-opacity"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{isLogin ? t("auth.loginBtn") : t("auth.registerBtn")}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social login line divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40"></div>
            </div>
            <span className="relative bg-card px-3 text-xs text-foreground/50 uppercase tracking-widest">Or</span>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                localStorage.setItem("luxe_user", JSON.stringify({ email: "google_user@gmail.com" }));
                router.push("/");
              }, 1000);
            }}
            className="flex items-center justify-center space-x-2.5 w-full py-3 border border-border hover:bg-luxe-rose/5 rounded-xl font-semibold text-sm text-foreground transition-all cursor-pointer"
          >
            {/* Tiny SVG Google icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 2.68-1.44 3.56v2.92h2.32c1.35-1.25 2.17-3.08 2.17-5.33z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.83-2.97c-1.08.73-2.46 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.17v3.07C3.15 21.05 7.28 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.27a7.22 7.22 0 0 1 0-4.54V6.66H1.17a11.96 11.96 0 0 0 0 10.68l4.07-3.07z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.28 0 3.15 2.95 1.17 6.66l4.07 3.07c.95-2.88 3.61-5.01 6.76-5.01z"
              />
            </svg>
            <span>{t("auth.googleBtn")}</span>
          </button>

          {/* Toggle form button */}
          <div className="text-center pt-6 text-xs text-foreground/75">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="hover:underline font-bold text-luxe-rose"
            >
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
            </button>
          </div>
        </GlassCard>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-foreground/50 hover:text-luxe-rose transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
