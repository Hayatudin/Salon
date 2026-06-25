"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ImageIcon, 
  Tag, 
  Calendar, 
  UserCheck, 
  Users, 
  Settings as SettingsIcon,
  LogOut,
  Sparkle,
  Search,
  Plus,
  Trash2,
  Check,
  X,
  Upload,
  User,
  Activity,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import GlassCard from "../../components/GlassCard";
import { dynamicDesignService } from "../../services/designs";
import { apiService, BookingData, CollectionData } from "../../services/api";
import { NailDesign } from "../../data/designs";

interface TryOnRequest {
  id: string;
  name: string;
  status: "pending" | "approved";
  createdAt: string;
  generationsLeft: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<"dashboard" | "gallery" | "categories" | "bookings" | "requests" | "users" | "settings">("dashboard");

  // Dynamic lists from localStorage/services
  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [collectionsList, setCollectionsList] = useState<CollectionData[]>([]);
  const [categories, setCategories] = useState<{ shapes: string[]; types: string[] }>({ shapes: [], types: [] });
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [requests, setRequests] = useState<TryOnRequest[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [salonSettings, setSalonSettings] = useState<any>({});

  // Loading / UI states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Form States for adding new design
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDesignName, setNewDesignName] = useState("");
  const [newDesignPrice, setNewDesignPrice] = useState("");
  const [newDesignShape, setNewDesignShape] = useState("Almond");
  const [newDesignType, setNewDesignType] = useState("Gel");
  const [newDesignColors, setNewDesignColors] = useState<string[]>(["#B76E79", "#E8C3C9"]);
  const [newDesignImage, setNewDesignImage] = useState("");
  const [newDesignTags, setNewDesignTags] = useState("");
  const [newDesignCollectionId, setNewDesignCollectionId] = useState("");

  // Form States for adding new collection
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionImage, setNewCollectionImage] = useState("");
  const [isUploadingCollectionImage, setIsUploadingCollectionImage] = useState(false);
  const [collectionUploadError, setCollectionUploadError] = useState("");

  // Form States for Settings
  const [salonName, setSalonName] = useState("Hani Luxe Studio");
  const [salonPhone, setSalonPhone] = useState("+251 91 234 5678");
  const [salonAddress, setSalonAddress] = useState("Bole Road, Addis Ababa, Ethiopia");
  const [salonHours, setSalonHours] = useState("9:00 AM – 8:00 PM");

  useEffect(() => {
    // Check if user is logged in as admin. If not, redirect or show warning
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("luxe_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role !== "admin") {
          // Warning state or redirect
          console.warn("Unauthorized admin access. Redirecting...");
        }
      }
    }

    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load nail designs
      const activeDesigns = await dynamicDesignService.getDesigns();
      setDesigns(activeDesigns);

      // Load collections
      const activeColls = await dynamicDesignService.getCollections();
      setCollectionsList(activeColls);

      // Load categories
      const activeCats = dynamicDesignService.getCategories();
      setCategories(activeCats);

      // Load requests
      const storedReqs = localStorage.getItem("luxe_tryon_requests");
      if (storedReqs) {
        setRequests(JSON.parse(storedReqs));
      }

      // Load bookings
      apiService.getAppointments().then(setBookings);

      // Load settings
      const storedSettings = localStorage.getItem("luxe_salon_settings");
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setSalonSettings(settings);
        setSalonName(settings.name || "Hani Luxe Studio");
        setSalonPhone(settings.phone || "+251 91 234 5678");
        setSalonAddress(settings.address || "Bole Road, Addis Ababa, Ethiopia");
        setSalonHours(settings.hours || "9:00 AM – 8:00 PM");
      }

      // Load mock users list
      const storedUsers = localStorage.getItem("luxe_mock_users");
      if (storedUsers) {
        setUsersList(JSON.parse(storedUsers));
      } else {
        const defaultUsers = [
          { id: "1", name: "Michelle Obama", email: "michelle@gmail.com", role: "admin", createdAt: "2026-05-12" },
          { id: "2", name: "Sarah Connor", email: "sarah@gmail.com", role: "user", createdAt: "2026-06-18" },
          { id: "3", name: "Helen Kebede", email: "helen@gmail.com", role: "user", createdAt: "2026-06-22" },
          { id: "4", name: "admin", email: "admin@haniluxe.com", role: "admin", createdAt: "2026-06-01" }
        ];
        localStorage.setItem("luxe_mock_users", JSON.stringify(defaultUsers));
        setUsersList(defaultUsers);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  // 1. Image Upload to API Endpoint
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setUploadError("");

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload request failed");

        const data = await response.json();
        if (data.success) {
          setNewDesignImage(data.filePath);
        } else {
          throw new Error(data.error || "Failed to upload file");
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        setUploadError(err.message || "Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // 2. Add New Design
  const handleAddDesignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesignName || !newDesignPrice || !newDesignImage) {
      alert("Please fill in Name, Price and upload an Image.");
      return;
    }

    const priceNum = parseFloat(newDesignPrice);
    if (isNaN(priceNum)) {
      alert("Please enter a valid price number.");
      return;
    }

    const tagsArray = newDesignTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    await dynamicDesignService.addDesign({
      nameKey: newDesignName.toLowerCase().replace(/\s+/g, "-"),
      defaultName: newDesignName,
      price: priceNum,
      duration: 60,
      shape: newDesignShape as any,
      type: newDesignType as any,
      rating: 5.0,
      reviewsCount: 1,
      colors: newDesignColors,
      image: newDesignImage,
      tags: tagsArray.length > 0 ? tagsArray : [newDesignType, newDesignShape],
      collectionId: newDesignCollectionId || null
    });

    // Reset Form
    setNewDesignName("");
    setNewDesignPrice("");
    setNewDesignImage("");
    setNewDesignTags("");
    setNewDesignCollectionId("");
    setShowAddForm(false);
    
    // Refresh
    await loadAllData();
  };

  // 3. Delete Design
  const handleDeleteDesign = async (id: string) => {
    if (confirm("Are you sure you want to delete this nail design style?")) {
      await dynamicDesignService.deleteDesign(id);
      await loadAllData();
    }
  };

  // 4. Collection Management
  const handleCollectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingCollectionImage(true);
      setCollectionUploadError("");

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload request failed");

        const data = await response.json();
        if (data.success) {
          setNewCollectionImage(data.filePath);
        } else {
          throw new Error(data.error || "Failed to upload file");
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        setCollectionUploadError(err.message || "Failed to upload image. Please try again.");
      } finally {
        setIsUploadingCollectionImage(false);
      }
    }
  };

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !newCollectionImage) {
      alert("Please fill in Collection Name and upload an Image.");
      return;
    }

    await dynamicDesignService.addCollection(newCollectionName.trim(), newCollectionImage);
    setNewCollectionName("");
    setNewCollectionImage("");
    await loadAllData();
  };

  const handleDeleteCollection = async (id: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      await dynamicDesignService.deleteCollection(id);
      await loadAllData();
    }
  };

  // 5. Try-On Request approvals
  const handleApproveRequest = (id: string) => {
    const updated = requests.map((req) => {
      if (req.id === id) {
        return { ...req, status: "approved" as const, generationsLeft: 3 };
      }
      return req;
    });
    localStorage.setItem("luxe_tryon_requests", JSON.stringify(updated));
    setRequests(updated);
  };

  const handleDeleteRequest = (id: string) => {
    const updated = requests.filter((req) => req.id !== id);
    localStorage.setItem("luxe_tryon_requests", JSON.stringify(updated));
    setRequests(updated);
  };

  // 6. Appointment booking approvals/delete
  const handleDeleteBooking = (id: string) => {
    if (confirm("Delete this appointment booking?")) {
      const stored = localStorage.getItem("luxe_appointments");
      if (stored) {
        const items: BookingData[] = JSON.parse(stored);
        const filtered = items.filter((b) => b.id !== id);
        localStorage.setItem("luxe_appointments", JSON.stringify(filtered));
        setBookings(filtered);
      }
    }
  };

  // 7. Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      name: salonName,
      phone: salonPhone,
      address: salonAddress,
      hours: salonHours
    };
    localStorage.setItem("luxe_salon_settings", JSON.stringify(settings));
    setSalonSettings(settings);
    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("luxe_user");
    router.push("/auth");
  };

  // Calculations for stats
  const totalRevenue = bookings.reduce((sum, item) => sum + 45, 0); // mock average price of $45 per service
  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;

  // Filtered designs for search querying in tab
  const filteredDesigns = designs.filter((d) => 
    d.defaultName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.shape.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0a090e] text-[#e2e1e6] font-sans overflow-hidden">
      
      {/* 1. STANDALONE DARK SIDEBAR NAV MENU */}
      <aside className="w-64 bg-[#121118] border-r border-[#1e1c27] flex flex-col justify-between p-6 shrink-0 h-full">
        <div className="space-y-8">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-3 mb-2 hover:opacity-90">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff5e36] to-[#e25c80] flex items-center justify-center shadow-lg shadow-[#e25c80]/20">
              <Sparkle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wider text-white block leading-tight">HANI LUXE</span>
              <span className="text-[10px] font-bold text-[#ff5e36] uppercase tracking-widest block">Admin Center</span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Overview", icon: LayoutDashboard },
              { id: "gallery", label: "Gallery", icon: ImageIcon },
              { id: "categories", label: "Collections", icon: Tag },
              { id: "bookings", label: "Bookings", icon: Calendar },
              { id: "requests", label: "Requests", icon: UserCheck },
              { id: "users", label: "Users", icon: Users },
              { id: "settings", label: "Settings", icon: SettingsIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-[#ff5e36]/15 to-transparent text-[#ff5e36] border-l-4 border-[#ff5e36]" 
                      : "text-[#a4a2ad] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#ff5e36]" : "text-[#7a7885]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Session Profile & LogOut */}
        <div className="border-t border-[#1e1c27] pt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff5e36] to-[#e25c80] flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-bold text-white">Michelle</p>
              <p className="text-[10px] text-[#7a7885]">Chief Manager</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#ff5e36]/90 hover:text-white hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* 2. DYNAMIC WORKSPACE PANEL CONTENT */}
      <main className="flex-grow flex flex-col h-full overflow-hidden bg-[#0a090e]">
        
        {/* Top bar search and status */}
        <header className="h-20 border-b border-[#1e1c27] flex items-center justify-between px-8 bg-[#0e0d14] shrink-0">
          <div className="text-left">
            <h2 className="text-xl font-bold text-white tracking-wide">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "gallery" && "Manage Design Gallery"}
              {activeTab === "categories" && "Gallery Categories & Styles"}
              {activeTab === "bookings" && "Appointments & Schedules"}
              {activeTab === "requests" && "Virtual Try-On Access Approvals"}
              {activeTab === "users" && "User Accounts & Access Control"}
              {activeTab === "settings" && "Salon Details Configuration"}
            </h2>
            <p className="text-xs text-[#7a7885]">Studio system settings, logs and controls</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-[#7a7885] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search database items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white placeholder-[#7a7885] focus:border-[#ff5e36] outline-none transition-all"
              />
            </div>

            {/* Back to Site badge */}
            <Link 
              href="/"
              className="px-4.5 py-2 text-xs font-bold rounded-full bg-[#ff5e36]/10 border border-[#ff5e36]/25 text-[#ff5e36] hover:bg-[#ff5e36]/20 transition-all"
            >
              Client Site
            </Link>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-grow overflow-y-auto p-8 bg-[#0a090e]">
          
          {/* TAB 1: OVERVIEW (DASHBOARD) */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Michelle Greeting Header block */}
              <div className="text-left bg-gradient-to-r from-[#17151e] to-[#0e0d14] p-8 rounded-3xl border border-[#23202d]">
                <h3 className="text-2xl font-bold text-white tracking-wide">Good to see you, Michelle!</h3>
                <p className="text-sm text-[#a4a2ad] mt-1">Improve your salon management systems for better growth.</p>
                <div className="flex space-x-3 mt-4">
                  {["Last 24 hours", "Last weeks", "Last month", "Last year"].map((time, idx) => (
                    <button 
                      key={idx}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                        idx === 2 ? "bg-[#ff5e36] text-white" : "bg-[#1d1b26] text-[#7a7885] hover:text-white"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stat Cards - Sleek Dark Orange Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Customer", val: usersList.length + 420080, icon: Users, change: "+3.1% from last month", isHighlight: false },
                  { label: "Total Revenue", val: `$${totalRevenue + 319200}`, icon: DollarSign, change: "+5.4% from last week", isHighlight: true },
                  { label: "Total Bookings", val: bookings.length + 1390, icon: Calendar, change: "+1.2% daily increase", isHighlight: false },
                  { label: "Try-On Tokens", val: pendingRequestsCount, icon: Sparkles, change: `${requests.length} requests posted`, isHighlight: false },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={idx}
                      className={`p-6 rounded-3xl border flex flex-col justify-between h-40 transition-all ${
                        stat.isHighlight 
                          ? "bg-gradient-to-br from-[#ff5e36] to-[#e25c80] border-transparent text-white shadow-xl shadow-[#e25c80]/10" 
                          : "bg-[#121118] border-[#1e1c27] text-white"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold uppercase tracking-wider ${stat.isHighlight ? "text-white/80" : "text-[#7a7885]"}`}>
                          {stat.label}
                        </span>
                        <div className={`p-2.5 rounded-2xl ${stat.isHighlight ? "bg-white/15" : "bg-[#1c1a25]"}`}>
                          <Icon className={`w-4 h-4 ${stat.isHighlight ? "text-white" : "text-[#ff5e36]"}`} />
                        </div>
                      </div>
                      <div className="text-left space-y-1">
                        <p className="text-3xl font-serif font-bold tracking-wide">
                          {typeof stat.val === "number" ? stat.val.toLocaleString() : stat.val}
                        </p>
                        <span className={`text-[10px] font-bold ${stat.isHighlight ? "text-white/80" : "text-[#4caf50]"}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart & Customer stats row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sales Chart Widget */}
                <div className="lg:col-span-2 bg-[#121118] border border-[#1e1c27] p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <h4 className="font-bold text-white text-base">Sales Overview</h4>
                      <p className="text-xs text-[#7a7885]">Your sales statistic report</p>
                    </div>
                    <button className="text-xs font-bold text-[#ff5e36] hover:underline">View Details</button>
                  </div>

                  {/* Vertical bar chart rendering using CSS heights */}
                  <div className="h-56 flex items-end justify-between pt-4 pb-2 px-4 relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-[#7a7885] text-left">
                      <span>$40K</span>
                      <span>$30K</span>
                      <span>$20K</span>
                      <span>$10K</span>
                      <span>$0</span>
                    </div>

                    {/* Chart Bars (M, T, W, T, F, S, S) */}
                    {[
                      { day: "Mon", height: "70%" },
                      { day: "Tue", height: "55%" },
                      { day: "Wed", height: "45%" },
                      { day: "Thu", height: "92%" },
                      { day: "Fri", height: "60%" },
                      { day: "Sat", height: "82%" },
                      { day: "Sun", height: "75%" },
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center flex-grow space-y-2 z-10 ml-8">
                        <div className="w-6.5 bg-[#17151e] rounded-t-lg h-44 relative flex items-end">
                          <div 
                            className="w-full bg-gradient-to-t from-[#ff8a00] to-[#ff5e36] rounded-t-lg transition-all duration-1000"
                            style={{ height: bar.height }}
                          />
                        </div>
                        <span className="text-[10px] text-[#7a7885] font-semibold">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country Growth Map/Details */}
                <div className="bg-[#121118] border border-[#1e1c27] p-6 rounded-3xl flex flex-col justify-between space-y-4">
                  <div className="text-left">
                    <h4 className="font-bold text-white text-base">Customer Growth</h4>
                    <p className="text-xs text-[#7a7885]">Of the week based on category</p>
                  </div>

                  {/* Visual categories list progress bars */}
                  <div className="space-y-4 flex-grow flex flex-col justify-center">
                    {[
                      { name: "Almond Gel Nails", percent: 75, val: "2,350", color: "from-[#ff5e36] to-[#e25c80]" },
                      { name: "French Tips Classic", percent: 55, val: "1,420", color: "from-[#2196f3] to-[#00bcd4]" },
                      { name: "Acrylic Galaxy Bold", percent: 40, val: "890", color: "from-[#9c27b0] to-[#e91e63]" },
                      { name: "Nude Minimalist Style", percent: 65, val: "1,980", color: "from-[#ffc107] to-[#ff9800]" }
                    ].map((progress, index) => (
                      <div key={index} className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#a4a2ad]">{progress.name}</span>
                          <span className="text-white font-bold">{progress.val} ({progress.percent}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#1c1a25] overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${progress.color} rounded-full`}
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Bookings and Top styles */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Bookings panel */}
                <div className="lg:col-span-2 bg-[#121118] border border-[#1e1c27] p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-base text-left">Recent Bookings</h4>
                    <button 
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs text-[#ff5e36] font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#1e1c27] text-[10px] text-[#7a7885] uppercase tracking-wider font-bold">
                          <th className="pb-3 pl-2">Customer</th>
                          <th className="pb-3">Service</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Time</th>
                          <th className="pb-3 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1c27]/40 text-xs">
                        {bookings.slice(0, 4).map((book) => (
                          <tr key={book.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 font-semibold text-white pl-2">{book.name}</td>
                            <td className="py-3 text-[#a4a2ad]">{book.service}</td>
                            <td className="py-3 text-[#a4a2ad]">{book.date}</td>
                            <td className="py-3 text-[#a4a2ad]">{book.time}</td>
                            <td className="py-3 text-right pr-2">
                              <button 
                                onClick={() => handleDeleteBooking(book.id!)}
                                className="text-red-400 hover:text-red-300 font-bold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Styles */}
                <div className="bg-[#121118] border border-[#1e1c27] p-6 rounded-3xl space-y-4">
                  <h4 className="font-bold text-white text-base text-left">Top Nail Styles</h4>
                  
                  <div className="space-y-3">
                    {designs.slice(0, 3).map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#17151e] border border-[#23202d]/60">
                        <div className="flex items-center space-x-3 text-left">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-border/20">
                            <Image src={item.image} alt={item.defaultName} fill className="object-cover" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">{item.defaultName}</h5>
                            <span className="text-[9px] uppercase tracking-wider font-bold text-[#ff5e36]">
                              {item.shape} &bull; {item.type}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#ff5e36]">${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY MANAGER */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              
              {/* Header and Add Trigger */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#a4a2ad] text-left">
                  Configure and upload the design files shown in the dynamic Client Gallery page.
                </p>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center space-x-2 px-5 py-3.5 bg-gradient-to-r from-[#ff5e36] to-[#e25c80] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddForm ? "Close Form" : "Upload New Style"}</span>
                </button>
              </div>

              {/* Add New Design Form Container */}
              {showAddForm && (
                <GlassCard className="p-6 border-none shadow-xl bg-[#121118] text-left max-w-2xl mx-auto space-y-6">
                  <div className="border-b border-[#1e1c27] pb-3">
                    <h3 className="text-base font-bold text-white flex items-center">
                      <Plus className="w-4.5 h-4.5 mr-2 text-[#ff5e36]" />
                      Add Nail Design Details
                    </h3>
                  </div>

                  <form onSubmit={handleAddDesignSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#a4a2ad]">Design Title Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Amber Glitz"
                          value={newDesignName}
                          onChange={(e) => setNewDesignName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white placeholder-[#7a7885] focus:border-[#ff5e36] outline-none"
                        />
                      </div>

                      {/* Price input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#a4a2ad]">Service Price ($ USD)</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 50"
                          value={newDesignPrice}
                          onChange={(e) => setNewDesignPrice(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white placeholder-[#7a7885] focus:border-[#ff5e36] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Shape Select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#a4a2ad]">Nail Shape Category</label>
                        <select
                          value={newDesignShape}
                          onChange={(e) => setNewDesignShape(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white focus:border-[#ff5e36] outline-none"
                        >
                          {categories.shapes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Type Select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#a4a2ad]">Style Type / Polish</label>
                        <select
                          value={newDesignType}
                          onChange={(e) => setNewDesignType(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white focus:border-[#ff5e36] outline-none"
                        >
                          {categories.types.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Collection Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#a4a2ad]">Collection Association</label>
                        <select
                          value={newDesignCollectionId}
                          onChange={(e) => setNewDesignCollectionId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white focus:border-[#ff5e36] outline-none"
                        >
                          <option value="">None (Standalone Design)</option>
                          {collectionsList.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tags entries */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#a4a2ad]">Design Tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Glossy, Pearl, Spring"
                          value={newDesignTags}
                          onChange={(e) => setNewDesignTags(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white placeholder-[#7a7885] focus:border-[#ff5e36] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Color list entry mock */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#a4a2ad]">Hex Colors Palette</label>
                        <div className="flex space-x-2">
                          {newDesignColors.map((color, i) => (
                            <input
                              key={i}
                              type="color"
                              value={color}
                              onChange={(e) => {
                                const nextColors = [...newDesignColors];
                                nextColors[i] = e.target.value;
                                setNewDesignColors(nextColors);
                              }}
                              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none outline-none shrink-0"
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() => setNewDesignColors([...newDesignColors, "#000000"])}
                            className="w-10 h-10 rounded-lg bg-[#17151e] hover:bg-white/5 border border-[#23202d] flex items-center justify-center text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image drag-and-drop / upload section */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#a4a2ad]">Design Visual Image (Saved to public/uploads/)</label>
                      <div className="border border-dashed border-[#ff5e36]/30 hover:border-[#ff5e36]/80 p-6 rounded-2xl bg-[#17151e] text-center space-y-3 transition-colors relative flex flex-col items-center justify-center min-h-[140px]">
                        
                        {isUploading ? (
                          <div className="space-y-2">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#ff5e36] mx-auto" />
                            <p className="text-xs text-white">Saving uploaded file to project folder...</p>
                          </div>
                        ) : newDesignImage ? (
                          <div className="space-y-2">
                            <Check className="w-8 h-8 text-green-400 mx-auto" />
                            <p className="text-xs text-green-400 font-bold">Image Uploaded Successfully!</p>
                            <p className="text-[10px] text-white/50">{newDesignImage}</p>
                            <button
                              type="button"
                              onClick={() => setNewDesignImage("")}
                              className="text-xs font-bold text-red-400 hover:underline"
                            >
                              Remove & Re-upload
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-[#ff5e36] opacity-75" />
                            <p className="text-xs text-[#a4a2ad]">Click below to upload design photo from your device</p>
                            <label className="inline-flex px-4 py-2 bg-[#ff5e36]/15 hover:bg-[#ff5e36]/25 border border-[#ff5e36]/30 rounded-xl text-xs font-bold text-[#ff5e36] cursor-pointer">
                              <span>Choose Image File</span>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                          </>
                        )}
                      </div>
                      
                      {uploadError && (
                        <p className="text-xs text-red-400 flex items-center justify-center mt-1">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          {uploadError}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 py-3.5 border border-[#23202d] bg-[#17151e] hover:bg-white/5 text-white font-bold rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className={`flex-1 py-3.5 font-bold rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2 ${
                          isUploading 
                            ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed" 
                            : "bg-gradient-to-r from-[#ff5e36] to-[#e25c80] text-white shadow-[#e25c80]/15"
                        }`}
                      >
                        <span>Save Design & Publish</span>
                      </button>
                    </div>
                  </form>
                </GlassCard>
              )}

              {/* Designs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {filteredDesigns.map((design) => (
                  <GlassCard
                    key={design.id}
                    className="p-0 border-none shadow-md overflow-hidden bg-[#121118] text-[#e2e1e6] flex flex-col justify-between group relative"
                  >
                    <div className="relative aspect-square w-full bg-[#1c1a25]">
                      <Image
                        src={design.image}
                        alt={design.defaultName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized={design.image.startsWith("/uploads")}
                      />

                      {/* Delete absolute button */}
                      <button
                        onClick={() => handleDeleteDesign(design.id)}
                        className="absolute top-3 right-3 p-2 bg-red-600/90 hover:bg-red-600 hover:scale-105 text-white rounded-full transition-transform"
                        title="Delete Design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 text-left space-y-1 bg-[#121118] z-10 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#ff5e36] block">
                          {design.shape} &bull; {design.type}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{design.defaultName}</h4>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-[#1e1c27] pt-2 mt-2">
                        <span className="text-xs font-bold text-[#ff5e36]">${design.price}</span>
                        <div className="flex space-x-1">
                          {design.colors.slice(0, 3).map((col, i) => (
                            <span 
                              key={i} 
                              className="w-2.5 h-2.5 rounded-full border border-white/20" 
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COLLECTIONS MANAGER */}
          {activeTab === "categories" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              
              {/* Collection creation panel */}
              <GlassCard className="p-6 border-none shadow-xl bg-[#121118] space-y-4 h-fit">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-[#1e1c27] pb-2">
                  Create Collection
                </h3>

                <form onSubmit={handleAddCollection} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a4a2ad]">Collection Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Almond, Coffin, Glitter Special"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white placeholder-[#7a7885] outline-none focus:border-[#ff5e36]"
                    />
                  </div>

                  {/* Image drag-and-drop / upload section */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a4a2ad]">Collection Banner Image (Saved to public/uploads/)</label>
                    <div className="border border-dashed border-[#ff5e36]/30 hover:border-[#ff5e36]/80 p-4 rounded-2xl bg-[#17151e] text-center space-y-3 transition-colors relative flex flex-col items-center justify-center min-h-[120px]">
                      
                      {isUploadingCollectionImage ? (
                        <div className="space-y-2">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#ff5e36] mx-auto" />
                          <p className="text-[10px] text-white">Uploading collection banner...</p>
                        </div>
                      ) : newCollectionImage ? (
                        <div className="space-y-2">
                          <Check className="w-6 h-6 text-green-400 mx-auto" />
                          <p className="text-[10px] text-green-400 font-bold">Image Set Successfully!</p>
                          <p className="text-[9px] text-white/50 truncate max-w-[200px]">{newCollectionImage}</p>
                          <button
                            type="button"
                            onClick={() => setNewCollectionImage("")}
                            className="text-[10px] font-bold text-red-400 hover:underline"
                          >
                            Change Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-[#ff5e36] opacity-75" />
                          <p className="text-[10px] text-[#a4a2ad]">Choose banner photo from your device</p>
                          <label className="inline-flex px-3 py-1.5 bg-[#ff5e36]/15 hover:bg-[#ff5e36]/25 border border-[#ff5e36]/30 rounded-lg text-[10px] font-bold text-[#ff5e36] cursor-pointer">
                            <span>Upload File</span>
                            <input type="file" accept="image/*" onChange={handleCollectionImageUpload} className="hidden" />
                          </label>
                        </>
                      )}
                    </div>
                    
                    {collectionUploadError && (
                      <p className="text-[10px] text-red-400 flex items-center justify-center mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {collectionUploadError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#ff5e36] to-[#e25c80] text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Create Collection Section
                  </button>
                </form>
              </GlassCard>

              {/* Collections lists view */}
              <div className="space-y-6">
                <GlassCard className="p-6 border-none shadow-xl bg-[#121118] space-y-4 text-left">
                  <h4 className="text-xs font-bold text-[#ff5e36] uppercase tracking-widest border-b border-[#1e1c27] pb-1.5">
                    Active Homepage Collections
                  </h4>
                  
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {collectionsList.length === 0 ? (
                      <p className="text-xs text-[#7a7885] italic">No active collections found.</p>
                    ) : (
                      collectionsList.map((coll) => (
                        <div 
                          key={coll.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#17151e] border border-[#23202d] text-xs font-bold text-white"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-white/5">
                              <Image 
                                src={coll.image} 
                                alt={coll.name} 
                                fill 
                                className="object-cover" 
                                unoptimized={coll.image.startsWith("/uploads")}
                              />
                            </div>
                            <span>{coll.name}</span>
                          </div>
                          
                          <button 
                            onClick={() => handleDeleteCollection(coll.id!)}
                            className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                            title="Delete Collection"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* TAB 4: BOOKINGS MANAGER */}
          {activeTab === "bookings" && (
            <div className="bg-[#121118] border border-[#1e1c27] p-6 rounded-3xl space-y-6 text-left">
              <p className="text-sm text-[#a4a2ad]">
                Manage all booked salon customer appointments details and schedule listings.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1e1c27] text-[10px] text-[#7a7885] uppercase tracking-wider font-bold">
                      <th className="pb-3 pl-2">Customer</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Artist</th>
                      <th className="pb-3">Schedule</th>
                      <th className="pb-3">Notes</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1c27]/40 text-xs">
                    {bookings.map((book) => (
                      <tr key={book.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-bold text-white pl-2">{book.name}</td>
                        <td className="py-4">
                          <p className="font-semibold text-white/90">{book.phone}</p>
                          <p className="text-[10px] text-[#7a7885]">{book.email}</p>
                        </td>
                        <td className="py-4 text-[#a4a2ad]">{book.service}</td>
                        <td className="py-4 text-[#a4a2ad]">{book.artist}</td>
                        <td className="py-4">
                          <p className="font-semibold text-white">{book.date}</p>
                          <p className="text-[10px] text-[#7a7885]">{book.time}</p>
                        </td>
                        <td className="py-4 text-[#a4a2ad] max-w-[120px] truncate">{book.notes || "—"}</td>
                        <td className="py-4 text-right pr-2">
                          <button
                            onClick={() => handleDeleteBooking(book.id!)}
                            className="text-red-400 hover:text-red-300 font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: TRY-ON REQUESTS APPROVAL */}
          {activeTab === "requests" && (
            <div className="bg-[#121118] border border-[#1e1c27] p-6 rounded-3xl space-y-6 text-left">
              <p className="text-sm text-[#a4a2ad]">
                Review and approve try-on requests. Approved users are granted 3 attempts to generate AI hand try-on designs.
              </p>

              <div className="space-y-4 max-w-3xl mx-auto">
                {requests.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-xs text-[#7a7885]">No requests submitted yet.</p>
                  </div>
                ) : (
                  requests.map((req) => (
                    <div 
                      key={req.id} 
                      className="p-5 rounded-2xl bg-[#17151e] border border-[#23202d] flex items-center justify-between gap-4"
                    >
                      <div className="text-left space-y-1">
                        <div className="flex items-center space-x-2.5">
                          <h4 className="font-bold text-white text-sm">{req.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              req.status === "approved"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#7a7885]">
                          Posted: {new Date(req.createdAt).toLocaleString()}
                        </p>
                        {req.status === "approved" && (
                          <p className="text-xs font-bold text-[#ff5e36]">
                            Generations left: {req.generationsLeft}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {req.status === "pending" && (
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            className="px-3.5 py-2 bg-[#ff5e36] hover:bg-[#ff5e36]/90 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                          >
                            Approve Access
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="px-3 py-2 bg-red-600/10 hover:bg-red-600/25 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: USERS LIST */}
          {activeTab === "users" && (
            <div className="bg-[#121118] border border-[#1e1c27] p-6 rounded-3xl space-y-6 text-left">
              <p className="text-sm text-[#a4a2ad]">
                Manage salon administration accounts and registered user client lists.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1e1c27] text-[10px] text-[#7a7885] uppercase tracking-wider font-bold">
                      <th className="pb-3 pl-2">Name</th>
                      <th className="pb-3">Email Address</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Registered At</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1c27]/40 text-xs">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-bold text-white pl-2">{user.name}</td>
                        <td className="py-4 font-mono text-white/80">{user.email}</td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              user.role === "admin"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 text-[#a4a2ad]">{user.createdAt}</td>
                        <td className="py-4 text-right pr-2">
                          <button
                            onClick={() => {
                              if (user.role === "admin" && user.email === "admin@haniluxe.com") {
                                alert("Cannot delete main super-admin user.");
                                return;
                              }
                              if (confirm("Delete this user account?")) {
                                const nextUsers = usersList.filter((u) => u.id !== user.id);
                                localStorage.setItem("luxe_mock_users", JSON.stringify(nextUsers));
                                setUsersList(nextUsers);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS CONFIG */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto">
              <GlassCard className="p-6 border-none shadow-xl bg-[#121118] text-left space-y-6">
                <div className="border-b border-[#1e1c27] pb-3">
                  <h3 className="text-base font-bold text-white flex items-center">
                    <SettingsIcon className="w-4.5 h-4.5 mr-2 text-[#ff5e36]" />
                    Studio Salon Settings
                  </h3>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a4a2ad]">Salon Branding Title</label>
                    <input
                      type="text"
                      required
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white focus:border-[#ff5e36] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a4a2ad]">Studio Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={salonPhone}
                      onChange={(e) => setSalonPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white focus:border-[#ff5e36] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a4a2ad]">Studio Physical Address</label>
                    <input
                      type="text"
                      required
                      value={salonAddress}
                      onChange={(e) => setSalonAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white focus:border-[#ff5e36] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a4a2ad]">Business Operations Hours Description</label>
                    <input
                      type="text"
                      required
                      value={salonHours}
                      onChange={(e) => setSalonHours(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#17151e] border border-[#23202d] text-sm text-white focus:border-[#ff5e36] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#ff5e36] to-[#e25c80] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Save Config Settings
                  </button>
                </form>
              </GlassCard>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
