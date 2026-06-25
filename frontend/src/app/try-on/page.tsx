"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { NailDesign } from "../../data/designs";
import { 
  Upload, 
  Camera, 
  Lock, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Sparkle,
  Image as ImageIcon,
  AlertCircle,
  Search
} from "lucide-react";
import GlassCard from "../../components/GlassCard";
import { dynamicDesignService } from "../../services/designs";

interface TryOnRequest {
  id: string;
  name: string;
  status: "pending" | "approved";
  createdAt: string;
  generationsLeft: number;
}

export default function TryOn() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Core States
  const [requestId, setRequestId] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<"none" | "pending" | "approved">("none");
  const [generationsLeft, setGenerationsLeft] = useState<number>(0);
  const [nameInput, setNameInput] = useState<string>("");
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  
  // Design & Category States
  const [designs, setDesigns] = useState<NailDesign[]>([]);
  const [categories, setCategories] = useState<{ shapes: string[]; types: string[] } | null>(null);
  const [activeShape, setActiveShape] = useState<string>("All");
  const [activeType, setActiveType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDesign, setSelectedDesign] = useState<NailDesign | null>(null);

  // Hand Image States
  const [originalHandImage, setOriginalHandImage] = useState<string | null>(null);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  
  // Camera States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // AI Mock states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");

  // 1. Initial Load & Approval Polling
  useEffect(() => {
    checkRequestStatus();
    
    // Load designs and categories dynamically
    dynamicDesignService.getDesigns().then((loadedDesigns) => {
      setDesigns(loadedDesigns);
      if (loadedDesigns.length > 0) {
        setSelectedDesign(loadedDesigns[0]);
      }
    });
    const loadedCategories = dynamicDesignService.getCategories();
    setCategories(loadedCategories);

    // Poll request status every 3 seconds to auto-update when admin approves
    const interval = setInterval(checkRequestStatus, 3000);
    return () => {
      clearInterval(interval);
      stopCamera();
    };
  }, []);

  const checkRequestStatus = () => {
    if (typeof window === "undefined") return;
    const storedUserReqId = localStorage.getItem("luxe_tryon_user_request_id");
    const storedRequests = localStorage.getItem("luxe_tryon_requests");

    if (storedUserReqId && storedRequests) {
      const requests: TryOnRequest[] = JSON.parse(storedRequests);
      const userReq = requests.find((r) => r.id === storedUserReqId);
      if (userReq) {
        setRequestId(userReq.id);
        setRequestStatus(userReq.status);
        setGenerationsLeft(userReq.generationsLeft);
        
        // If approved and status was none or pending, update local state
        if (userReq.status === "approved" && requestStatus !== "approved") {
          setRequestStatus("approved");
          setGenerationsLeft(userReq.generationsLeft);
        }
        return;
      }
    }
    
    // Fallback if no request found
    setRequestId(null);
    setRequestStatus("none");
    setGenerationsLeft(0);
  };

  // 2. Access Request Submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newReq: TryOnRequest = {
      id: `req-${Date.now()}`,
      name: nameInput.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
      generationsLeft: 0,
    };

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("luxe_tryon_requests");
      const currentRequests = stored ? JSON.parse(stored) : [];
      currentRequests.unshift(newReq);
      localStorage.setItem("luxe_tryon_requests", JSON.stringify(currentRequests));
      localStorage.setItem("luxe_tryon_user_request_id", newReq.id);
    }

    setRequestId(newReq.id);
    setRequestStatus("pending");
    setGenerationsLeft(0);
    setShowRequestModal(false);
  };

  // 3. Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setOriginalHandImage(dataUrl);
          setAiGeneratedImage(null); // Reset prev generation
          if (!isLocked && generationsLeft > 0 && selectedDesign) {
            triggerAiGeneration(dataUrl, selectedDesign);
          }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // 4. Camera (Webcam) Integration
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Webcam access denied or unavailable. Please upload a photo instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !isCameraActive) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setOriginalHandImage(dataUrl);
      setAiGeneratedImage(null); // Reset prev generation
      stopCamera();
      if (!isLocked && generationsLeft > 0 && selectedDesign) {
        triggerAiGeneration(dataUrl, selectedDesign);
      }
    }
  };

  // 5. Simulated AI Nail Generator Composition
  const triggerAiGeneration = (handImgUrl = originalHandImage, designToUse = selectedDesign) => {
    if (!handImgUrl || !designToUse || generationsLeft <= 0 || isGenerating) return;

    setIsGenerating(true);
    setGenerationStep("AI is analyzing hand contours...");

    // Simulated steps
    setTimeout(() => {
      setGenerationStep("Aligning smart nail beds...");
      setTimeout(() => {
        setGenerationStep("Synthesizing AI luxury textures...");
        setTimeout(() => {
          renderNailsOnCanvas(handImgUrl, designToUse);
        }, 800);
      }, 800);
    }, 900);
  };

  const renderNailsOnCanvas = (handImgUrl: string, designToUse: NailDesign) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handImg = new window.Image();
    handImg.crossOrigin = "anonymous";
    handImg.src = handImgUrl;
    handImg.onload = () => {
      // Set canvas size matching the hand image to keep proportions
      canvas.width = handImg.naturalWidth || 600;
      canvas.height = handImg.naturalHeight || 750;

      // Draw hand base image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(handImg, 0, 0, canvas.width, canvas.height);

      // Programmatic finger coordinates adjusted relative to canvas resolution
      const scaleX = canvas.width / 400;
      const scaleY = canvas.height / 500;
      
      const baseFingers = [
        { x: 100 * scaleX, y: 250 * scaleY, angle: -15, width: 22 * scaleX },
        { x: 165 * scaleX, y: 155 * scaleY, angle: -5, width: 17 * scaleX },
        { x: 225 * scaleX, y: 140 * scaleY, angle: 2, width: 18 * scaleX },
        { x: 285 * scaleX, y: 150 * scaleY, angle: 8, width: 17 * scaleX },
        { x: 340 * scaleX, y: 200 * scaleY, angle: 18, width: 14 * scaleX },
      ];

      ctx.save();
      baseFingers.forEach((finger) => {
        ctx.save();
        ctx.translate(finger.x, finger.y);
        ctx.rotate(finger.angle * Math.PI / 180);

        const w = finger.width / 2;
        const len = 32 * scaleY; // length proportion

        // Draw almond nail shape
        ctx.beginPath();
        ctx.moveTo(-w, 0);
        ctx.bezierCurveTo(-w, -len * 0.5, -w * 0.3, -len * 1.05, 0, -len * 1.05);
        ctx.bezierCurveTo(w * 0.3, -len * 1.05, w, -len * 0.5, w, 0);
        ctx.bezierCurveTo(w, w * 0.5, -w, w * 0.5, -w, 0);
        ctx.closePath();

        // Draw design colors gradient
        ctx.globalAlpha = 0.9;
        const baseColor = designToUse.colors[0];
        const accentColor = designToUse.colors[1] || designToUse.colors[0];
        const gradient = ctx.createLinearGradient(0, 0, 0, -len);
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, accentColor);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw realistic shine
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.moveTo(-w * 0.4, 0);
        ctx.bezierCurveTo(-w * 0.4, -len * 0.5, -w * 0.1, -len * 0.9, 0, -len * 0.9);
        ctx.lineTo(-w * 0.1, -len * 0.9);
        ctx.bezierCurveTo(-w * 0.5, -len * 0.5, -w * 0.5, 0, -w * 0.5, 0);
        ctx.closePath();
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        // Glitter effect if applicable
        if (designToUse.tags?.includes("Glitter") || designToUse.id?.includes("galaxy")) {
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = "#FFFFFF";
          for (let i = 0; i < 4; i++) {
            const gx = (Math.random() - 0.5) * w * 1.5;
            const gy = -Math.random() * len;
            ctx.fillRect(gx, gy, 2, 2);
          }
        }

        // French tip if applicable
        if (designToUse.type === "French") {
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(0, -len + 2, w * 0.8, 0, Math.PI, true);
          ctx.fill();
        }

        ctx.restore();
      });
      ctx.restore();

      // Convert to image and update state
      const outputUrl = canvas.toDataURL("image/png");
      setAiGeneratedImage(outputUrl);
      setIsGenerating(false);

      // Decrement remaining generations locally and in list
      const nextGens = Math.max(0, generationsLeft - 1);
      setGenerationsLeft(nextGens);
      
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("luxe_tryon_requests");
        if (stored && requestId) {
          const requests: TryOnRequest[] = JSON.parse(stored);
          const updated = requests.map((r) => {
            if (r.id === requestId) {
              return { ...r, generationsLeft: nextGens };
            }
            return r;
          });
          localStorage.setItem("luxe_tryon_requests", JSON.stringify(updated));
        }
      }
    };
  };

  const isLocked = requestStatus !== "approved";

  // Filter nail designs dynamically based on search query and category filters
  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = design.defaultName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShape = activeShape === "All" || design.shape === activeShape;
    const matchesType = activeType === "All" || design.type === activeType;
    return matchesSearch && matchesShape && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-32 py-10 w-full space-y-12">
      {/* Hidden processing canvas used for rendering composite preview */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-luxe-rose uppercase tracking-widest">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>AI Virtual Experience</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-wide">
          {t("tryOn.title")}
        </h1>
        <p className="text-sm sm:text-base text-foreground/75 max-w-xl mx-auto leading-relaxed font-light font-sans">
          Snap a photo of your hand, choose any luxury style from our gallery, and let our custom AI instantly render your new look.
        </p>

        {/* Admin Link shortcut badge */}
        <div className="pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-luxe-rose/10 hover:bg-luxe-rose/20 text-luxe-rose border border-luxe-rose/25 rounded-full text-xs font-semibold tracking-wide transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Go to Admin Panel Requests Page</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
        {/* Left Side: Upload / Capture Hand Photo section (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 border-none shadow-xl space-y-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-widest border-b border-border/30 pb-2 flex items-center justify-between">
              <span>1. Hand Workspace</span>
              {requestStatus === "approved" && (
                <span className="text-xs font-bold text-luxe-rose bg-luxe-rose/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  {generationsLeft} generations left
                </span>
              )}
            </h3>

            {/* Lock Overlay for Pending/None request status */}
            {isLocked && (
              <div className="absolute inset-0 bg-[#23000e]/95 z-30 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-luxe-rose/10 border border-luxe-rose/20 flex items-center justify-center shadow-lg shadow-luxe-rose/5">
                  <Lock className="w-8 h-8 text-luxe-rose" />
                </div>
                
                <div className="space-y-2 max-w-md">
                  <h4 className="text-xl font-serif font-bold text-white">AI Try-On Locked</h4>
                  <p className="text-sm text-foreground/75 leading-relaxed font-sans">
                    Access is restricted by default. Submit a request with your name to be approved by the administrator.
                  </p>
                </div>

                {requestStatus === "pending" ? (
                  <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold uppercase tracking-wider animate-pulse">
                    <span>Waiting for Admin Approval...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="px-8 py-3.5 bg-rose-gradient text-white rounded-full font-bold text-sm shadow-xl shadow-luxe-rose/25 hover:opacity-90 transition-all cursor-pointer"
                  >
                    Request Access
                  </button>
                )}
              </div>
            )}

            {/* Camera feed / Uploaded image display or Split View */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-luxe-dark-burgundy/60 border border-border flex items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 z-10">
                    <button
                      onClick={capturePhoto}
                      className="px-5 py-2.5 bg-rose-gradient text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:opacity-95"
                    >
                      Capture Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2.5 bg-white/10 text-white font-bold text-xs rounded-xl border border-white/15 cursor-pointer hover:bg-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : originalHandImage ? (
                /* Split Comparison View */
                <div className="grid grid-cols-2 w-full h-full divide-x divide-border/40 bg-[#161219]">
                  {/* Left Column: Original Hand */}
                  <div className="relative w-full h-full flex flex-col justify-between p-3">
                    <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white/70">
                      Original
                    </span>
                    <div className="relative flex-grow w-full">
                      <Image
                        src={originalHandImage}
                        alt="Original Hand Input"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 350px"
                      />
                    </div>
                  </div>

                  {/* Right Column: AI Rendered Hand */}
                  <div className="relative w-full h-full flex flex-col justify-between p-3 bg-[#1d1822]">
                    <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-luxe-rose/80 text-white">
                      AI Rendered
                    </span>
                    
                    {isGenerating && (
                      <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center p-4 text-center space-y-3">
                        <RefreshCw className="w-7 h-7 animate-spin text-luxe-rose" />
                        <p className="text-xs font-bold text-white tracking-wide animate-pulse font-mono">{generationStep}</p>
                      </div>
                    )}

                    <div className="relative flex-grow w-full flex items-center justify-center">
                      {aiGeneratedImage ? (
                        <Image
                          src={aiGeneratedImage}
                          alt="AI Generated Nails"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 50vw, 350px"
                        />
                      ) : (
                        <div className="text-center p-4 space-y-2">
                          <Sparkles className="w-8 h-8 text-foreground/20 mx-auto" />
                          <p className="text-[10px] text-foreground/45 max-w-[155px] mx-auto leading-relaxed">
                            Select a design on the right to auto-generate AI preview
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Main Placeholder state */
                <div className="text-center p-8 space-y-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground/30">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">No Hand Photo Uploaded</p>
                    <p className="text-xs text-foreground/50 max-w-xs font-sans">
                      Take a photo using your webcam or upload an existing photo to virtually try on our designs.
                    </p>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <label className="flex items-center space-x-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer text-xs font-semibold transition-all">
                      <Upload className="w-3.5 h-3.5 text-luxe-rose" />
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>

                    <button
                      onClick={startCamera}
                      className="flex items-center space-x-2 py-2.5 px-4 rounded-xl bg-rose-gradient text-white text-xs font-bold shadow-md shadow-luxe-rose/25 cursor-pointer hover:opacity-95 transition-all"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Start Camera</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hand Action Controls below side-by-side view */}
            {originalHandImage && !isCameraActive && (
              <div className="flex items-center justify-between border-t border-border/30 pt-4 flex-wrap gap-3">
                <div className="flex space-x-2">
                  <label className="flex items-center space-x-1.5 py-2 px-3.5 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer text-xs font-semibold transition-all">
                    <Upload className="w-3.5 h-3.5 text-luxe-rose" />
                    <span>Change Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  
                  <button
                    onClick={() => {
                      setOriginalHandImage(null);
                      setAiGeneratedImage(null);
                    }}
                    className="py-2 px-3.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <button
                  onClick={() => triggerAiGeneration(originalHandImage, selectedDesign)}
                  disabled={generationsLeft <= 0 || isGenerating}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md ${
                    generationsLeft <= 0 || isGenerating
                      ? "bg-white/5 text-foreground/45 border border-white/10 cursor-not-allowed"
                      : "bg-rose-gradient text-white hover:opacity-95 cursor-pointer"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-Generate Render</span>
                </button>
              </div>
            )}

            {cameraError && (
              <p className="text-xs text-red-400 text-center flex items-center justify-center mt-2 font-mono">
                <AlertCircle className="w-4 h-4 mr-1 shrink-0" />
                {cameraError}
              </p>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Select a Design Panel (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 border-none shadow-xl space-y-5 text-left relative">
            <div className="border-b border-border/30 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Choose Design
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground focus:border-luxe-rose placeholder:text-foreground/30 transition-colors font-sans"
              />
              <Search className="w-4 h-4 text-foreground/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Filters */}
            {categories && (
              <div className="space-y-3 border-t border-b border-border/20 py-3 my-2 font-sans">
                {/* Shape Filters */}
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">Shape</span>
                  <div className="flex flex-wrap gap-1">
                    {["All", ...categories.shapes].map((shape) => (
                      <button
                        key={shape}
                        onClick={() => setActiveShape(shape)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                          activeShape === shape
                            ? "bg-luxe-rose text-white"
                            : "bg-white/5 text-foreground/60 hover:bg-white/10"
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filters */}
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">Type</span>
                  <div className="flex flex-wrap gap-1">
                    {["All", ...categories.types].map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                          activeType === type
                            ? "bg-luxe-rose text-white"
                            : "bg-white/5 text-foreground/60 hover:bg-white/10"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Nail Design Selection Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-none">
              {filteredDesigns.map((design) => (
                <button
                  key={design.id}
                  onClick={() => {
                    setSelectedDesign(design);
                    if (originalHandImage && generationsLeft > 0 && !isGenerating && !isLocked) {
                      triggerAiGeneration(originalHandImage, design);
                    }
                  }}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    selectedDesign?.id === design.id
                      ? "border-luxe-rose ring-2 ring-luxe-rose/30 scale-95"
                      : "border-border hover:border-luxe-rose/30"
                  }`}
                  title={design.defaultName}
                >
                  <Image
                    src={design.image}
                    alt={design.defaultName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 150px"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-1.5 text-center">
                    <p className="text-[9px] font-bold truncate text-white">{design.defaultName}</p>
                  </div>
                  {selectedDesign?.id === design.id && (
                    <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-luxe-rose text-white rounded-full flex items-center justify-center border border-white/20">
                      <Check className="w-2.5 h-2.5 font-bold" />
                    </div>
                  )}
                </button>
              ))}

              {filteredDesigns.length === 0 && (
                <div className="col-span-3 text-center py-8 text-xs text-foreground/45 font-sans">
                  No designs match your criteria.
                </div>
              )}
            </div>

            {/* Selected Design Preview Info Card */}
            {selectedDesign && (
              <div className="p-3 rounded-xl bg-luxe-dark-burgundy/40 border border-border/40 flex items-center space-x-3.5">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-border/50">
                  <Image src={selectedDesign.image} alt={selectedDesign.defaultName} fill className="object-cover" />
                </div>
                <div className="text-left space-y-0.5 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-luxe-rose font-mono">
                    {selectedDesign.shape} &bull; {selectedDesign.type}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate font-serif">{selectedDesign.defaultName}</h4>
                  <p className="text-[10px] text-foreground/60 font-sans">${selectedDesign.price} &bull; {selectedDesign.duration} mins</p>
                </div>
              </div>
            )}

            {/* Color Tint mock picker */}
            <div className="space-y-2 border-t border-border/30 pt-4 text-left font-sans">
              <span className="text-xs font-bold text-white flex items-center">
                Color Tint
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "None", color: "transparent" },
                  { name: "Rose", color: "#B76E79" },
                  { name: "Burgundy", color: "#800020" },
                  { name: "Gold", color: "#D4AF37" },
                  { name: "Pearl", color: "#E8C3C9" },
                  { name: "Nude", color: "#E5C7BC" },
                  { name: "Midnight", color: "#111111" }
                ].map((tint, i) => (
                  <button
                    key={i}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${
                      i === 0 
                        ? "border-luxe-rose ring-2 ring-luxe-rose/20 bg-gradient-to-tr from-white/10 to-white/40 flex items-center justify-center text-[9px] text-foreground font-bold" 
                        : "border-border hover:scale-105"
                    }`}
                    style={i > 0 ? { backgroundColor: tint.color } : undefined}
                    title={tint.name}
                  >
                    {i === 0 ? "✕" : ""}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-foreground/45 leading-normal">
                Tint overlays on top of the selected design.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Name Input Request Modal Dialog */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-6 border-none shadow-2xl space-y-6 text-left relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 p-2 text-foreground/50 hover:text-foreground text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-foreground">Request Try-On Access</h3>
              <p className="text-xs text-foreground/75 leading-normal font-sans">
                Please enter your full name below. Your request will be instantly posted to the admin panel dashboard for immediate approval.
              </p>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 font-sans">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/70">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-foreground/30 focus:border-luxe-rose outline-none"
                  autoFocus
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-3 border border-border hover:bg-luxe-rose/5 text-foreground rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-luxe-rose/25 cursor-pointer hover:opacity-95"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
