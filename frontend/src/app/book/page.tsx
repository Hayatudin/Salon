"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiService, BookingData } from "../../services/api";
import { Clock, User, Calendar, Check, ArrowLeft, ArrowRight, Printer, AlertCircle } from "lucide-react";
import GlassCard from "../../components/GlassCard";

const servicesList = [
  { id: "classic-mani", name: "Classic Manicure", price: 25, duration: 30, desc: "Essential cleaning, shaping, cuticle care, and regular polish." },
  { id: "gel-mani", name: "Gel Polish Manicure", price: 35, duration: 45, desc: "Long-lasting gel polish cured under LED light." },
  { id: "acrylic-ext", name: "Acrylic Extensions", price: 55, duration: 70, desc: "Bespoke full set acrylic sculpting and tip extensions." },
  { id: "nail-art", name: "Nail Art Design", price: 40, duration: 60, desc: "Hand-painted detailed designs, gems, or chrome finishes." },
  { id: "bridal-pkg", name: "Bridal Package", price: 85, duration: 90, desc: "Premium bridal set with shimmers, details, and care." },
  { id: "spa-pedi", name: "Luxury Spa Pedicure", price: 45, duration: 60, desc: "Exfoliating foot massage, scrub, care, and gel polish." },
];

const artists = [
  { id: "hani", name: "Hani", specialty: "Acrylic Extensions & Sculpting", rating: "4.9 (150+ reviews)" },
  { id: "sara", name: "Sara", specialty: "Bespoke Gel Nail Art", rating: "4.8 (120+ reviews)" },
  { id: "meron", name: "Meron", specialty: "Luxury Spa Pedicures & Care", rating: "4.7 (95+ reviews)" },
];

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

function BookingForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // Multi-step current state
  const [step, setStep] = useState(1);
  
  // Selected Data states
  const [selectedService, setSelectedService] = useState(servicesList[0]);
  const [selectedArtist, setSelectedArtist] = useState<string>("No Preference");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // Input fields state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [bookingResult, setBookingResult] = useState<BookingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate from URL query params
  useEffect(() => {
    const urlService = searchParams.get("service");
    const urlNotes = searchParams.get("notes");
    
    if (urlService) {
      const match = servicesList.find(s => s.name.toLowerCase() === urlService.toLowerCase()) || 
                    servicesList.find(s => s.name.toLowerCase().includes(urlService.toLowerCase()));
      if (match) setSelectedService(match);
    }
    
    if (urlNotes) {
      setNotes(decodeURIComponent(urlNotes));
    }
  }, [searchParams]);

  // Calendar dates generation (Current + next 14 days)
  const getDatesList = () => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      // Skip Sundays (salon closed)
      if (nextDate.getDay() !== 0) {
        list.push({
          raw: nextDate.toISOString().split("T")[0],
          dayName: nextDate.toLocaleDateString("en-US", { weekday: "short" }),
          dayNum: nextDate.getDate(),
          monthName: nextDate.toLocaleDateString("en-US", { month: "short" }),
        });
      }
    }
    return list;
  };
  const dates = getDatesList();

  const handleBookingSubmit = async () => {
    if (!name || !phone || !email || !selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    const bookingPayload: BookingData = {
      name,
      phone,
      email,
      service: selectedService.name,
      artist: selectedArtist,
      date: selectedDate,
      time: selectedTime,
      notes: notes || undefined,
    };

    const res = await apiService.createAppointment(bookingPayload);
    setBookingResult(res);
    setIsSubmitting(false);
    setStep(5); // Success step
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-wide">
          {t("book.title")}
        </h1>
        <p className="text-sm sm:text-base text-foreground/75 max-w-xl mx-auto leading-relaxed">
          {t("book.subtitle")}
        </p>
      </div>

      {/* Booking Form Layout */}
      {step < 5 && (
        <div className="space-y-6">
          {/* Step Indicators */}
          <div className="flex justify-between items-center max-w-lg mx-auto border-b border-border/30 pb-4">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => s < step && setStep(s)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                  step === s
                    ? "bg-rose-gradient text-white border-transparent shadow-md shadow-luxe-rose/25"
                    : s < step
                    ? "border-luxe-rose text-luxe-rose bg-luxe-rose/5 cursor-pointer"
                    : "border-border text-foreground/40 cursor-not-allowed"
                }`}
                disabled={s > step}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </button>
            ))}
          </div>

          {/* STEP 1: CHOOSE SERVICE */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-serif font-bold text-center text-foreground">
                1. Select Nail Care Treatment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicesList.map((service) => (
                  <GlassCard
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`border border-border/80 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                      selectedService.id === service.id
                        ? "border-luxe-rose bg-luxe-rose/5 ring-1 ring-luxe-rose/20"
                        : "hover:bg-luxe-rose/5"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif font-bold text-base text-foreground">{service.name}</h3>
                        <span className="text-base font-bold text-luxe-rose">${service.price}</span>
                      </div>
                      <p className="text-xs text-foreground/70 mt-2 leading-relaxed">{service.desc}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-border/30 text-xs text-foreground/50">
                      <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-luxe-rose" /> {service.duration} Min</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT ARTIST */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-center text-foreground">
                2. Select Preferred Stylist
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* No preference */}
                <GlassCard
                  onClick={() => setSelectedArtist("No Preference")}
                  className={`border border-border/80 p-6 rounded-2xl text-center flex flex-col justify-center items-center min-h-[160px] ${
                    selectedArtist === "No Preference" ? "border-luxe-rose bg-luxe-rose/5" : "hover:bg-luxe-rose/5"
                  }`}
                >
                  <User className="w-8 h-8 text-foreground/40 mb-3" />
                  <h3 className="font-serif font-bold text-base">{t("book.noPreference")}</h3>
                  <p className="text-xs text-foreground/50 mt-1">Assign first available artist</p>
                </GlassCard>

                {artists.map((artist) => (
                  <GlassCard
                    key={artist.id}
                    onClick={() => setSelectedArtist(artist.name)}
                    className={`border border-border/80 p-6 rounded-2xl text-center flex flex-col justify-center items-center min-h-[160px] ${
                      selectedArtist === artist.name ? "border-luxe-rose bg-luxe-rose/5" : "hover:bg-luxe-rose/5"
                    }`}
                  >
                    <User className="w-8 h-8 text-luxe-rose mb-3" />
                    <h3 className="font-serif font-bold text-base text-foreground">{artist.name}</h3>
                    <p className="text-xs text-luxe-rose font-medium mt-1">{artist.specialty}</p>
                    <p className="text-[10px] text-foreground/50 mt-2">Rating: {artist.rating}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SELECT DATE & TIME */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-center text-foreground">
                3. Choose Date & Time
              </h2>
              
              {/* Date slider */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest block">
                  Available Dates
                </label>
                <div className="flex space-x-2.5 overflow-x-auto pb-3 scrollbar-thin">
                  {dates.map((dateObj) => (
                    <button
                      key={dateObj.raw}
                      onClick={() => setSelectedDate(dateObj.raw)}
                      className={`flex flex-col items-center p-3 rounded-xl border min-w-[70px] transition-all ${
                        selectedDate === dateObj.raw
                          ? "border-luxe-rose bg-luxe-rose/10 text-luxe-rose shadow-md"
                          : "border-border text-foreground hover:bg-luxe-rose/5"
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider font-bold opacity-60">{dateObj.monthName}</span>
                      <span className="text-xl font-bold font-serif my-0.5">{dateObj.dayNum}</span>
                      <span className="text-[10px] font-semibold">{dateObj.dayName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="space-y-3 pt-4 border-t border-border/30 animate-fade-in">
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest block">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          selectedTime === slot
                            ? "border-luxe-rose bg-luxe-rose/10 text-luxe-rose"
                            : "border-border text-foreground hover:bg-luxe-rose/5"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CONFIRM & CUSTOM DETAILS */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Form Input fields */}
              <GlassCard className="border border-border/80 p-6 space-y-4 md:col-span-7">
                <h3 className="font-serif font-bold text-lg text-foreground border-b border-border/30 pb-2">
                  Client Information
                </h3>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">{t("book.nameLabel")}</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">{t("book.phoneLabel")}</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">{t("book.emailLabel")}</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">{t("book.notesLabel")}</label>
                  <textarea
                    rows={3}
                    placeholder="Special nail requirements or custom design names..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-sm outline-none text-foreground resize-none"
                  />
                </div>
              </GlassCard>

              {/* Review Sidebar Card */}
              <GlassCard className="border border-border/80 p-6 space-y-4 md:col-span-5 bg-luxe-gradient text-white">
                <h3 className="font-serif font-bold text-lg border-b border-white/10 pb-2">
                  {t("book.bookingSummary")}
                </h3>
                
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">{t("book.service")}</span>
                    <span className="font-bold text-right">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">{t("book.artist")}</span>
                    <span className="font-bold text-rose-200">{selectedArtist}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">{t("book.dateTime")}</span>
                    <span className="font-bold text-right">{selectedDate} at {selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="opacity-60 font-bold">{t("book.total")}</span>
                    <span className="text-lg font-bold text-luxe-rose">${selectedService.price} USD</span>
                  </div>
                </div>

                <div className="text-[10px] text-rose-200/50 flex items-start space-x-1 pt-4">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                  <span>No prepayment required. Payment is processed at the salon. Please arrive 10 minutes early.</span>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-6 max-w-lg mx-auto">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-1.5 px-6 py-2.5 border border-border hover:bg-luxe-rose/5 rounded-xl font-bold text-sm text-foreground transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={(step === 3 && (!selectedDate || !selectedTime))}
                className={`flex items-center space-x-1.5 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all ${
                  (step === 3 && (!selectedDate || !selectedTime))
                    ? "bg-border text-foreground/30 cursor-not-allowed"
                    : "bg-rose-gradient shadow-md shadow-luxe-rose/25 hover:opacity-95 cursor-pointer"
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleBookingSubmit}
                disabled={!name || !phone || !email || isSubmitting}
                className={`flex items-center space-x-1.5 px-8 py-3 rounded-xl font-bold text-sm text-white shadow-xl shadow-luxe-rose/20 transition-all ${
                  (!name || !phone || !email || isSubmitting)
                    ? "bg-border text-foreground/30 cursor-not-allowed"
                    : "bg-rose-gradient hover:opacity-95 cursor-pointer"
                }`}
              >
                {isSubmitting ? <span>Booking...</span> : <span>{t("book.confirmBtn")}</span>}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS TICKET PRINT SCREEN */}
      {step === 5 && bookingResult && (
        <GlassCard className="max-w-xl mx-auto border border-border/80 p-8 text-center space-y-6 bg-card text-foreground print:border-none print:shadow-none shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-500">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {t("book.successTitle")}
            </h2>
            <p className="text-sm text-foreground/75 leading-relaxed max-w-md mx-auto">
              {t("book.successText")}
            </p>
          </div>

          {/* Ticket Body Card */}
          <div className="border border-dashed border-border/80 rounded-2xl p-6 text-left space-y-4 bg-background/50">
            <div className="flex justify-between border-b border-border/30 pb-2">
              <span className="text-xs text-foreground/50 uppercase tracking-widest">Booking ID</span>
              <span className="text-sm font-bold font-mono text-luxe-rose">{bookingResult.id}</span>
            </div>
            
            <div className="flex justify-between border-b border-border/30 pb-2">
              <span className="text-xs text-foreground/50 uppercase tracking-widest">Client Name</span>
              <span className="text-sm font-bold">{bookingResult.name}</span>
            </div>

            <div className="flex justify-between border-b border-border/30 pb-2">
              <span className="text-xs text-foreground/50 uppercase tracking-widest">Treatment Service</span>
              <span className="text-sm font-bold">{bookingResult.service}</span>
            </div>

            <div className="flex justify-between border-b border-border/30 pb-2">
              <span className="text-xs text-foreground/50 uppercase tracking-widest">Nail Stylist</span>
              <span className="text-sm font-bold text-luxe-rose">{bookingResult.artist}</span>
            </div>

            <div className="flex justify-between border-b border-border/30 pb-2">
              <span className="text-xs text-foreground/50 uppercase tracking-widest">Scheduled Time</span>
              <span className="text-sm font-bold">{bookingResult.date} at {bookingResult.time}</span>
            </div>

            {bookingResult.notes && (
              <div className="pt-1 text-xs text-foreground/60 leading-relaxed">
                <span className="font-bold block text-[10px] text-foreground/45 uppercase tracking-wide">Client Notes</span>
                <p className="mt-1 bg-background p-2.5 rounded-lg border border-border/30">{bookingResult.notes}</p>
              </div>
            )}
          </div>

          {/* Print/Download triggers */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center space-x-2 w-full py-3.5 border border-border hover:bg-luxe-rose/5 rounded-xl font-bold text-sm text-foreground transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t("book.downloadInvoice")}</span>
            </button>
            
            <button
              onClick={() => {
                setStep(1);
                setName("");
                setPhone("");
                setEmail("");
                setNotes("");
                setSelectedDate("");
                setSelectedTime("");
                setBookingResult(null);
              }}
              className="w-full py-3.5 bg-rose-gradient text-white rounded-xl font-bold text-sm shadow-md hover:opacity-95 transition-opacity cursor-pointer"
            >
              Book Another Appointment
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default function Book() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <p className="text-foreground/50">Loading Booking System...</p>
      </div>
    }>
      <BookingForm />
    </Suspense>
  );
}
