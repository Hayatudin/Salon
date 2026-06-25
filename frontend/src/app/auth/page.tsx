"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { 
  Lock, 
  Mail, 
  ChevronRight, 
  AlertCircle, 
  ArrowLeft, 
  Heart, 
  Calendar, 
  LogOut, 
  User, 
  Settings, 
  Trash2, 
  Shield, 
  Sparkles,
  Eye,
  Clock,
  Edit3,
  Save
} from "lucide-react";
import GlassCard from "../../components/GlassCard";
import { nailDesigns, NailDesign } from "../../data/designs";
import { apiService, BookingData } from "../../services/api";

export default function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ email: string; role?: string; name?: string } | null>(null);

  // Auth form
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile tabs
  const [activeTab, setActiveTab] = useState<"favorites" | "bookings" | "settings">("favorites");

  // Profile data
  const [favDesigns, setFavDesigns] = useState<NailDesign[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);

  // Settings form
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof window === "undefined") return;
    const userStr = localStorage.getItem("luxe_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setUserData(user);
      setProfileName(user.name || user.email.split("@")[0]);
      setProfileEmail(user.email);
      loadProfileData();
    }
  };

  const loadProfileData = () => {
    // Load favorites
    const savedFavIds = localStorage.getItem("luxe_favorites");
    if (savedFavIds) {
      const ids: string[] = JSON.parse(savedFavIds);
      const filtered = nailDesigns.filter((d) => ids.includes(d.id));
      setFavDesigns(filtered);
    }

    // Load bookings
    apiService.getAppointments().then(setBookings);
  };

  const removeGalleryFavorite = (id: string) => {
    const savedFavIds = localStorage.getItem("luxe_favorites");
    if (savedFavIds) {
      const ids: string[] = JSON.parse(savedFavIds);
      const updated = ids.filter((fid) => fid !== id);
      localStorage.setItem("luxe_favorites", JSON.stringify(updated));
      setFavDesigns(favDesigns.filter((d) => d.id !== id));
    }
  };

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

    setTimeout(() => {
      setLoading(false);
      const isAdmin = email === "admin@haniluxe.com" && password === "admin123";
      const user = { email, role: isAdmin ? "admin" : "user", name: email.split("@")[0] };
      localStorage.setItem("luxe_user", JSON.stringify(user));
      
      if (isAdmin) {
        router.push("/admin");
      } else {
        setIsLoggedIn(true);
        setUserData(user);
        setProfileName(user.name);
        setProfileEmail(user.email);
        loadProfileData();
      }
    }, 1200);
  };

  const handleLogout = () => {
    localStorage.removeItem("luxe_user");
    setIsLoggedIn(false);
    setUserData(null);
    setFavDesigns([]);
    setBookings([]);
    setEmail("");
    setPassword("");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const updated = { ...userData, name: profileName, email: profileEmail };
      localStorage.setItem("luxe_user", JSON.stringify(updated));
      setUserData(updated as any);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 800);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await apiService.changePassword(
        profileEmail,
        currentPassword,
        newPassword
      );

      if (result.success) {
        setPasswordSuccess("Password updated successfully in database!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordError(result.error || "Failed to update password.");
      }
    } catch (e: any) {
      setPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ─── NOT LOGGED IN: AUTH FORM ──────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 lg:pl-32">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-bold text-foreground">
              {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
            </h1>
            <p className="text-sm text-foreground/75 leading-relaxed">
              {isLogin ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}
            </p>
            {isLogin && (
              <div className="text-xs bg-luxe-rose/10 border border-luxe-rose/25 text-luxe-rose px-3 py-2 rounded-xl mt-2 max-w-sm mx-auto font-semibold">
                Admin Login: <span className="font-mono text-foreground">admin@haniluxe.com</span> / <span className="font-mono text-foreground">admin123</span>
              </div>
            )}
          </div>

          {/* Auth Box */}
          <GlassCard className="border border-border/80 p-8 shadow-2xl relative bg-card text-foreground">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="flex items-center space-x-2 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose transition-colors"
                />
              </div>

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
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose transition-colors"
                />
              </div>

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
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose transition-colors"
                  />
                </div>
              )}

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

            {/* Social login divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40"></div>
              </div>
              <span className="relative bg-card px-3 text-xs text-foreground/50 uppercase tracking-widest">Or</span>
            </div>

            {/* Google OAuth */}
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  const user = { email: "google_user@gmail.com", role: "user", name: "Google User" };
                  localStorage.setItem("luxe_user", JSON.stringify(user));
                  setIsLoggedIn(true);
                  setUserData(user);
                  setProfileName(user.name);
                  setProfileEmail(user.email);
                  loadProfileData();
                }, 1000);
              }}
              className="flex items-center justify-center space-x-2.5 w-full py-3 border border-border hover:bg-luxe-rose/5 rounded-xl font-semibold text-sm text-foreground transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 2.68-1.44 3.56v2.92h2.32c1.35-1.25 2.17-3.08 2.17-5.33z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.83-2.97c-1.08.73-2.46 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.17v3.07C3.15 21.05 7.28 24 12 24z" />
                <path fill="#FBBC05" d="M5.24 14.27a7.22 7.22 0 0 1 0-4.54V6.66H1.17a11.96 11.96 0 0 0 0 10.68l4.07-3.07z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.28 0 3.15 2.95 1.17 6.66l4.07 3.07c.95-2.88 3.61-5.01 6.76-5.01z" />
              </svg>
              <span>{t("auth.googleBtn")}</span>
            </button>

            {/* Toggle form */}
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

  // ─── LOGGED IN: FULL PROFILE DASHBOARD ──────────────────────
  const initials = (userData?.name || userData?.email || "U").substring(0, 2).toUpperCase();
  const isAdmin = userData?.role === "admin";

  const profileTabs = [
    { id: "favorites" as const, label: "My Favorites", icon: Heart, count: favDesigns.length },
    { id: "bookings" as const, label: "My Bookings", icon: Calendar, count: bookings.length },
    { id: "settings" as const, label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-32 py-10 w-full space-y-8">
      
      {/* ─── PROFILE HERO HEADER ─── */}
      <div className="glass-card relative bg-gradient-to-br from-luxe-rose/20 via-luxe-burgundy/10 to-transparent p-8 sm:p-10 rounded-2xl border border-border/60 overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-luxe-rose/10 blur-[100px] rounded-full -z-0"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-rose-gradient flex items-center justify-center shadow-xl shadow-luxe-rose/25 shrink-0">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-white">{initials}</span>
          </div>

          <div className="text-center sm:text-left flex-grow space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {userData?.name || userData?.email.split("@")[0]}
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-luxe-rose/15 border border-luxe-rose/25 text-[10px] font-bold uppercase tracking-wider text-luxe-rose w-fit mx-auto sm:mx-0">
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                </span>
              )}
            </div>
            <p className="text-sm text-foreground/60 font-mono">{userData?.email}</p>
            <p className="text-xs text-foreground/50">Member since {new Date().getFullYear()}</p>
          </div>

          <div className="flex gap-2 shrink-0">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-luxe-rose/10 border border-luxe-rose/25 hover:bg-luxe-rose/20 text-luxe-rose rounded-xl text-xs font-bold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 border border-border hover:bg-red-500/10 hover:border-red-500/25 hover:text-red-400 text-foreground/70 rounded-xl text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── STATS ROW ─── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Saved Designs", value: favDesigns.length, icon: Heart, color: "text-pink-400" },
          { label: "Appointments", value: bookings.length, icon: Calendar, color: "text-amber-400" },
          { label: "Try-On Credits", value: "3", icon: Sparkles, color: "text-violet-400" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={i} className="border border-border/50 p-5 text-center space-y-2">
              <Icon className={`w-5 h-5 mx-auto ${stat.color}`} />
              <p className="text-2xl font-serif font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">{stat.label}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* ─── TABS ─── */}
      <div className="flex border-b border-border/30 overflow-x-auto scrollbar-none">
        {profileTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-luxe-rose text-luxe-rose"
                  : "border-transparent text-foreground/50 hover:text-foreground/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {"count" in tab && typeof tab.count === "number" && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id 
                    ? "bg-luxe-rose/15 text-luxe-rose" 
                    : "bg-foreground/10 text-foreground/50"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── TAB CONTENT ─── */}

      {/* FAVORITES TAB */}
      {activeTab === "favorites" && (
        <div className="space-y-6">
          {favDesigns.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {favDesigns.map((design) => (
                <GlassCard
                  key={design.id}
                  className="border border-border/60 p-0 rounded-2xl overflow-hidden flex flex-col group relative"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={design.image}
                      alt={design.defaultName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized={design.image.startsWith("/uploads")}
                    />
                    {/* Remove button */}
                    <button
                      onClick={() => removeGalleryFavorite(design.id)}
                      className="absolute right-3 top-3 p-2 rounded-full glass-effect border border-white/10 text-red-500 hover:scale-110 transition-transform"
                      title="Remove from favorites"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="p-4 flex-grow flex flex-col justify-between bg-card text-foreground">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-luxe-rose block">
                        {design.shape} &bull; {design.type}
                      </span>
                      <h3 className="font-serif font-bold text-sm mt-1">{design.defaultName}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                      <span className="text-xs font-bold text-luxe-rose">${design.price}</span>
                      <Link
                        href={`/book?service=${encodeURIComponent(design.defaultName)}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-gradient text-white rounded-lg text-[10px] font-bold shadow-md shadow-luxe-rose/25 hover:opacity-90"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Book</span>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-luxe-rose/10 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7 text-luxe-rose/50" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">No saved designs yet</h3>
              <p className="text-sm text-foreground/60 max-w-sm mx-auto">
                Browse our gallery and tap the heart icon on designs you love to save them here.
              </p>
              <Link
                href="/gallery"
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-rose-gradient text-white rounded-xl text-sm font-bold shadow-md shadow-luxe-rose/25 hover:opacity-90"
              >
                <Eye className="w-4 h-4" />
                <span>Browse Gallery</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((book) => (
                <GlassCard key={book.id} className="border border-border/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-grow">
                    <div className="w-12 h-12 rounded-2xl bg-luxe-rose/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-luxe-rose" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h4 className="font-bold text-foreground text-sm">{book.service}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/60">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{book.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{book.time}</span>
                        </span>
                        {book.artist && (
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{book.artist}</span>
                          </span>
                        )}
                      </div>
                      {book.notes && (
                        <p className="text-[11px] text-foreground/45 italic mt-1">{book.notes}</p>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">
                    Confirmed
                  </span>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-luxe-rose/10 flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7 text-luxe-rose/50" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">No bookings yet</h3>
              <p className="text-sm text-foreground/60 max-w-sm mx-auto">
                Schedule your first appointment and treat yourself to a luxurious nail experience.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-rose-gradient text-white rounded-xl text-sm font-bold shadow-md shadow-luxe-rose/25 hover:opacity-90"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Now</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="max-w-xl mx-auto space-y-6">
          <GlassCard className="border border-border/60 p-6 sm:p-8 space-y-6">
            <div className="border-b border-border/30 pb-3">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center space-x-2">
                <Edit3 className="w-4.5 h-4.5 text-luxe-rose" />
                <span>Edit Profile</span>
              </h3>
              <p className="text-xs text-foreground/50 mt-1">Update your personal details</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/70 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-luxe-rose" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/70 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-luxe-rose" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center space-x-2 w-full py-3.5 bg-rose-gradient text-white rounded-xl font-bold text-sm shadow-xl shadow-luxe-rose/25 hover:opacity-95 transition-opacity"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : saveSuccess ? (
                  <>
                    <span>Saved Successfully!</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* Password Change Section */}
          <GlassCard className="border border-border/60 p-6 sm:p-8 space-y-6">
            <div className="border-b border-border/30 pb-3">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center space-x-2">
                <Lock className="w-4.5 h-4.5 text-luxe-rose" />
                <span>Change Password</span>
              </h3>
              <p className="text-xs text-foreground/50 mt-1">Ensure your account is secure with a new password</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {passwordError && (
                <div className="flex items-center space-x-2 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-center space-x-2 text-xs font-bold text-green-500 bg-green-500/10 border border-green-500/20 p-3.5 rounded-xl">
                  <Sparkles className="w-4 h-4 shrink-0 text-green-400" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/70 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-luxe-rose" />
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/70 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-luxe-rose" />
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/70 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-luxe-rose" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex items-center justify-center space-x-2 w-full py-3.5 bg-rose-gradient text-white rounded-xl font-bold text-sm shadow-xl shadow-luxe-rose/25 hover:opacity-95 transition-opacity"
              >
                {isChangingPassword ? (
                  <span>Updating...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* Danger Zone */}
          <GlassCard className="border border-red-500/15 p-6 space-y-4">
            <h3 className="text-sm font-bold text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Danger Zone</span>
            </h3>
            <p className="text-xs text-foreground/50">
              Logging out will clear your session. Your favorites and bookings will persist for your next login.
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-5 py-2.5 border border-red-500/25 hover:bg-red-500/10 text-red-400 rounded-xl text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Account</span>
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
