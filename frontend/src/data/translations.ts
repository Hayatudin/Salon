export interface TranslationSchema {
  nav: {
    home: string;
    gallery: string;
    tryOn: string;
    customStudio: string;
    bookNow: string;
    aiAssistant: string;
    favorites: string;
    login: string;
    register: string;
    profile: string;
    logout: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    exploreBtn: string;
    bookBtn: string;
    statsExperience: string;
    statsClients: string;
    statsAwards: string;
    featuredTitle: string;
    featuredSubtitle: string;
    collectionsTitle: string;
    storyTitle: string;
    storyText: string;
    testimonialsTitle: string;
    contactTitle: string;
    hoursTitle: string;
    weekdays: string;
    sunday: string;
    address: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    detailsBtn: string;
    bookStyleBtn: string;
    price: string;
    duration: string;
    shape: string;
    type: string;
  };
  tryOn: {
    title: string;
    subtitle: string;
    uploadBtn: string;
    useTemplate: string;
    selectDesign: string;
    adjustNails: string;
    scale: string;
    rotate: string;
    length: string;
    blendMode: string;
    downloadBtn: string;
    dragPrompt: string;
  };
  customStudio: {
    title: string;
    subtitle: string;
    shapeLabel: string;
    colorLabel: string;
    textureLabel: string;
    glossy: string;
    matte: string;
    glitter: string;
    chrome: string;
    decorLabel: string;
    decorNone: string;
    decorFrench: string;
    decorGlitter: string;
    decorStones: string;
    decorLines: string;
    designNamePlaceholder: string;
    saveFavorite: string;
    successSave: string;
  };
  book: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    notesLabel: string;
    artistLabel: string;
    noPreference: string;
    bookingSummary: string;
    service: string;
    artist: string;
    dateTime: string;
    total: string;
    confirmBtn: string;
    successTitle: string;
    successText: string;
    downloadInvoice: string;
  };
  ai: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    sendBtn: string;
    outfitTitle: string;
    outfitText: string;
    outfitUploadBtn: string;
    outfitScanning: string;
    outfitResult: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    galleryTab: string;
    customTab: string;
    noFavorites: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    emailLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    loginBtn: string;
    registerBtn: string;
    googleBtn: string;
    noAccount: string;
    hasAccount: string;
  };
}

export const translations: Record<string, TranslationSchema> = {
  en: {
    nav: {
      home: "Home",
      gallery: "Gallery",
      tryOn: "Try-On",
      customStudio: "Custom Studio",
      bookNow: "Book Now",
      aiAssistant: "AI Beauty",
      favorites: "Favorites",
      login: "Login",
      register: "Register",
      profile: "Profile",
      logout: "Logout",
    },
    home: {
      heroTitle: "Where Beauty Meets Artistry",
      heroSubtitle: "Indulge in a premium nail care experience tailored to your unique style. Book your session today at Addis Ababa's premier nail studio.",
      exploreBtn: "Explore Designs",
      bookBtn: "Book Appointment",
      statsExperience: "Years Experience",
      statsClients: "Happy Clients",
      statsAwards: "Design Awards",
      featuredTitle: "Featured Designs",
      featuredSubtitle: "Trending styles curated by our top artists",
      collectionsTitle: "Browse Collections",
      storyTitle: "Our Story",
      storyText: "Hani Luxe Studio is a premier beauty destination in Addis Ababa. We specialize in high-end acrylic extensions, bespoke gel nail art, and luxury spa pedicures. Our mission is to elevate your self-care routine into an art form, providing meticulous service in a relaxing, sophisticated environment.",
      testimonialsTitle: "What Our Clients Say",
      contactTitle: "Visit Us",
      hoursTitle: "Business Hours",
      weekdays: "Monday - Saturday: 9:00 AM - 8:00 PM",
      sunday: "Sunday: 10:00 AM - 6:00 PM",
      address: "Bole Road, Addis Ababa, Ethiopia",
    },
    gallery: {
      title: "Design Gallery",
      subtitle: "Find your next look. Search by keyword or filter by style collection.",
      searchPlaceholder: "Search designs...",
      filterAll: "All Designs",
      detailsBtn: "View Details",
      bookStyleBtn: "Book with this Style",
      price: "Price",
      duration: "Duration",
      shape: "Shape",
      type: "Type",
    },
    tryOn: {
      title: "Virtual Try-On",
      subtitle: "See how our premium designs look on your hand instantly.",
      uploadBtn: "Upload Hand Photo",
      useTemplate: "Use Hand Template",
      selectDesign: "Select a Design",
      adjustNails: "Adjust Nails Position",
      scale: "Scale / Size",
      rotate: "Rotation",
      length: "Nail Length",
      blendMode: "Realism Blend",
      downloadBtn: "Download Preview",
      dragPrompt: "Drag and align the nail template onto your fingers.",
    },
    customStudio: {
      title: "Nail Design Studio",
      subtitle: "Be your own designer. Create a custom style and attach it to your booking request.",
      shapeLabel: "Choose Shape",
      colorLabel: "Choose Base Color",
      textureLabel: "Finish Texture",
      glossy: "High Glossy",
      matte: "Soft Matte",
      glitter: "Glitter Shimmer",
      chrome: "Metallic Chrome",
      decorLabel: "Add Decorations",
      decorNone: "None",
      decorFrench: "French Tips",
      decorGlitter: "Glitter Dust",
      decorStones: "Rhinestones",
      decorLines: "Geometric Lines",
      designNamePlaceholder: "Name your design (e.g. Midnight Sparks)...",
      saveFavorite: "Save Custom Design",
      successSave: "Design saved to your favorites!",
    },
    book: {
      title: "Book Appointment",
      subtitle: "Reserve your session with Addis Ababa's finest nail artists.",
      step1: "Choose Service",
      step2: "Select Artist",
      step3: "Select Date & Time",
      step4: "Confirm Details",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address",
      notesLabel: "Special Notes or Custom Design Name",
      artistLabel: "Preferred Artist",
      noPreference: "No preference (First available)",
      bookingSummary: "Booking Summary",
      service: "Service",
      artist: "Artist",
      dateTime: "Date & Time",
      total: "Total Price",
      confirmBtn: "Confirm & Print Ticket",
      successTitle: "Appointment Requested!",
      successText: "Thank you! Your appointment request has been submitted. A confirmation SMS will be sent to your phone shortly.",
      downloadInvoice: "Download Appointment Card",
    },
    ai: {
      title: "AI Beauty Specialist",
      subtitle: "Ask our virtual assistant for personalized styling advice and color matching.",
      inputPlaceholder: "Ask about nail styles, skin tones, nail care tips...",
      sendBtn: "Send",
      outfitTitle: "Outfit Color Scanner",
      outfitText: "Upload a photo of your dress or outfit, and our AI will recommend matching nail designs.",
      outfitUploadBtn: "Upload Outfit Photo",
      outfitScanning: "Scanning outfit colors...",
      outfitResult: "We detected these colors in your outfit and recommend these designs:",
    },
    favorites: {
      title: "Your Favorites",
      subtitle: "Your saved gallery styles and custom creations.",
      galleryTab: "Gallery Favorites",
      customTab: "My Custom Designs",
      noFavorites: "No favorites saved yet. Browse the gallery or try the Custom Studio to add some!",
    },
    auth: {
      loginTitle: "Welcome Back",
      loginSubtitle: "Sign in to manage your appointments and custom designs.",
      registerTitle: "Create Account",
      registerSubtitle: "Join Hani Luxe Studio for loyalty rewards and custom designs.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      loginBtn: "Sign In",
      registerBtn: "Sign Up",
      googleBtn: "Continue with Google",
      noAccount: "Don't have an account? Sign Up",
      hasAccount: "Already have an account? Sign In",
    },
  },
  am: {
    nav: {
      home: "መነሻ",
      gallery: "ጋለሪ",
      tryOn: "ሙከራ",
      customStudio: "ዲዛይን ስቱዲዮ",
      bookNow: "ቀጠሮ ይያዙ",
      aiAssistant: "AI ውበት",
      favorites: "ተወዳጆች",
      login: "ይግቡ",
      register: "ይመዝገቡ",
      profile: "መገለጫ",
      logout: "ውጣ",
    },
    home: {
      heroTitle: "ውበት ከጥበብ ጋር የሚገናኝበት",
      heroSubtitle: "ለእርስዎ ልዩ ዘይቤ የተዘጋጀ ልዩ የጥፍር እንክብካቤ ተሞክሮ ያግኙ። አሁኑኑ በአዲስ አበባ ቀዳሚ የጥፍር ስቱዲዮ ቀጠሮዎን ይያዙ።",
      exploreBtn: "ዲዛይኖችን ይመልከቱ",
      bookBtn: "ቀጠሮ ይያዙ",
      statsExperience: "ዓመታት ልምድ",
      statsClients: "ደስተኛ ደንበኞች",
      statsAwards: "የዲዛይን ሽልማቶች",
      featuredTitle: "ተለይተው የቀረቡ ዲዛይኖች",
      featuredSubtitle: "በዋና ባለሙያዎቻችን የተመረጡ ወቅታዊ ጥፍሮች",
      collectionsTitle: "ስብስቦችን ይመልከቱ",
      storyTitle: "የእኛ ታሪክ",
      storyText: "ሀኒ ሉክስ ስቱዲዮ በአዲስ አበባ ውስጥ ቀዳሚ የውበት መዳረሻ ነው። በከፍተኛ ደረጃ አክሬሊክስ ኤክስቴንሽን፣ በጄል ጥፍር ጥበብ እና በቅንጦት ስፓ ፔዲክዩር ላይ ልዩ ባለሙያ ነን። ዓላማችን የእርስዎን የግል እንክብካቤ ወደ ጥበብ ማሳደግ ነው።",
      testimonialsTitle: "ደንበኞቻችን ምን ይላሉ?",
      contactTitle: "ይምጡና ይጎብኙን",
      hoursTitle: "የስራ ሰዓታት",
      weekdays: "ሰኞ - ቅዳሜ: ከጠዋቱ 3:00 - ከምሽቱ 2:00 ሰዓት",
      sunday: "እሁድ: ከጠዋቱ 4:00 - ከሰዓት በኋላ 12:00 ሰዓት",
      address: "ቦሌ መንገድ፣ አዲስ አበባ፣ ኢትዮጵያ",
    },
    gallery: {
      title: "የዲዛይን ጋለሪ",
      subtitle: "የሚቀጥለውን ውበትዎን ይምረጡ። በቁልፍ ቃላት ይፈልጉ ወይም በስብስቦች ያጣሩ።",
      searchPlaceholder: "ዲዛይኖችን ይፈልጉ...",
      filterAll: "ሁሉም ዲዛይኖች",
      detailsBtn: "ዝርዝር ይመልከቱ",
      bookStyleBtn: "በዚህ ዲዛይን ቀጠሮ ይያዙ",
      price: "ዋጋ",
      duration: "የሚፈጀው ጊዜ",
      shape: "ቅርፅ",
      type: "ዓይነት",
    },
    tryOn: {
      title: "በትዕይንት መሞከሪያ",
      subtitle: "የእኛ ዲዛይኖች በእጅዎ ላይ እንዴት እንደሚታዩ ወዲያውኑ ይመልከቱ።",
      uploadBtn: "የእጅ ፎቶ ይጫኑ",
      useTemplate: "የናሙና እጅ ይጠቀሙ",
      selectDesign: "ዲዛይን ይምረጡ",
      adjustNails: "የጥፍሮቹን አቀማመጥ ያስተካክሉ",
      scale: "መጠን / ስፋት",
      rotate: "ማዞሪያ",
      length: "የጥፍር ርዝመት",
      blendMode: "እውነተኛ ውህደት",
      downloadBtn: "ምስሉን አውርድ",
      dragPrompt: "የጥፍር ናሙናውን በጣቶችዎ ላይ ይጎትቱና ያስተካክሉ።",
    },
    customStudio: {
      title: "የጥፍር ዲዛይን ስቱዲዮ",
      subtitle: "የራስዎ ዲዛይነር ይሁኑ። የራስዎን ልዩ ዘይቤ ይፍጠሩ እና ከቀጠሮዎ ጋር ያያይዙት።",
      shapeLabel: "ቅርፅ ይምረጡ",
      colorLabel: "የመነሻ ቀለም ይምረጡ",
      textureLabel: "የቀለም አይነት",
      glossy: "እጅግ አንጸባራቂ (Glossy)",
      matte: "ማት (Matte)",
      glitter: "ብልጭልጭ (Glitter)",
      chrome: "ብረታማ (Chrome)",
      decorLabel: "ጌጣጌጦችን ይጨምሩ",
      decorNone: "ምንም",
      decorFrench: "ፈረንሳይ ቲፕስ",
      decorGlitter: "ብልጭልጭ አቧራ",
      decorStones: "ድንጋዮች / ራይንስቶን",
      decorLines: "መስመራዊ ዲዛይን",
      designNamePlaceholder: "የዲዛይንዎን ስም ይሰይሙ (ምሳሌ፦ የእኩለ ሌሊት ኮከብ)...",
      saveFavorite: "ዲዛይኑን አስቀምጥ",
      successSave: "ዲዛይኑ በተሳካ ሁኔታ ተቀምጧል!",
    },
    book: {
      title: "ቀጠሮ ይያዙ",
      subtitle: "በአዲስ አበባ ምርጥ ባለሙያዎች ቀጠሮዎን ያስይዙ።",
      step1: "አገልግሎት ይምረጡ",
      step2: "ባለሙያ ይምረጡ",
      step3: "ቀን እና ሰዓት ይምረጡ",
      step4: "ዝርዝሮችን ያረጋግጡ",
      nameLabel: "ሙሉ ስም",
      phoneLabel: "ስልክ ቁጥር",
      emailLabel: "ኢሜል አድራሻ",
      notesLabel: "ልዩ ማስታወሻዎች ወይም የራስዎ ዲዛይን ስም",
      artistLabel: "ተመራጭ ባለሙያ",
      noPreference: "ምርጫ የለኝም (ቀድሞ ለተገኘ ባለሙያ)",
      bookingSummary: "የቀጠሮ ማጠቃለያ",
      service: "አገልግሎት",
      artist: "ባለሙያ",
      dateTime: "ቀን እና ሰዓት",
      total: "ጠቅላላ ዋጋ",
      confirmBtn: "ያረጋግጡ እና ቲኬት ያውጡ",
      successTitle: "ቀጠሮ ተይዟል!",
      successText: "እናመሰግናለን! የቀጠሮ ጥያቄዎ በተሳካ ሁኔታ ቀርቧል። የማረጋገጫ መልእክት በቅርቡ በስልክዎ ይደርስዎታል።",
      downloadInvoice: "የቀጠሮ ካርድ ያውርዱ",
    },
    ai: {
      title: "የ-AI ውበት ረዳት",
      subtitle: "ለግል ዘይቤዎ እና ከቆዳ ቀለምዎ ጋር ለሚስማሙ ምክሮች የ-AI ረዳታችንን ይጠይቁ።",
      inputPlaceholder: "ስለ ጥፍር ስታይል፣ የቆዳ ቀለም፣ ጥፍር እንክብካቤ ይጠይቁ...",
      sendBtn: "ላክ",
      outfitTitle: "የልብስ ቀለም አንባቢ",
      outfitText: "የልብስዎን ፎቶ ይጫኑ እና የእኛ AI ከልብስዎ ጋር የሚስማሙ የጥፍር ዲዛይኖችን ይጠቁማል።",
      outfitUploadBtn: "የልብስ ፎቶ ይጫኑ",
      outfitScanning: "የልብስ ቀለሞችን በማንበብ ላይ...",
      outfitResult: "በልብስዎ ላይ የተገኙት ቀለሞች እና የምንመክራቸው ዲዛይኖች፦",
    },
    favorites: {
      title: "ተወዳጆችዎ",
      subtitle: "ያስቀመጧቸው የጋለሪ ስታይሎች እና የራስዎ ፈጠራዎች።",
      galleryTab: "የጋለሪ ተወዳጆች",
      customTab: "የእኔ የጥፍር ፈጠራዎች",
      noFavorites: "እስካሁን ምንም ተወዳጅ አልተቀመጠም። ጋለሪውን ይመልከቱ ወይም በስቱዲዮ የራስዎን ይፍጠሩ!",
    },
    auth: {
      loginTitle: "እንኳን ደህና መጡ",
      loginSubtitle: "ቀጠሮዎችዎን እና የራስዎን ዲዛይኖች ለማስተዳደር ይግቡ።",
      registerTitle: "መለያ ይፍጠሩ",
      registerSubtitle: "ለተለያዩ ሽልማቶች እና ዲዛይኖች ለማስቀመጥ ሀኒ ሉክስን ይቀላቀሉ።",
      emailLabel: "ኢሜል አድራሻ",
      passwordLabel: "የይለፍ ቃል",
      confirmPasswordLabel: "የይለፍ ቃል ያረጋግጡ",
      loginBtn: "ይግቡ",
      registerBtn: "ይመዝገቡ",
      googleBtn: "በጉግል (Google) ይቀጥሉ",
      noAccount: "መለያ የለዎትም? ይመዝገቡ",
      hasAccount: "መለያ አለዎት? ይግቡ",
    },
  },
};
